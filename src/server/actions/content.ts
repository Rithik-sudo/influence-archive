'use server';

import { eq, inArray, sql } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import {
  articles,
  articleCategories,
  articlePeople,
  articleRelations,
  articleSources,
  articleTags,
  categories,
  collectionItems,
  collections,
  mediaAssets,
  siteSettings,
  sources,
  tags,
} from '@/server/db/schema';
import { withDb } from '@/server/db/tx';
import { slugify } from '@/lib/slug';
import {
  articleSchema,
  collectionSchema,
  settingSchema,
  sourceSchema,
} from '@/lib/validation';
import {
  fieldErrorsFrom,
  parseForm,
  recordAudit,
  revalidatePublic,
  requireEditorForAction,
  type ActionState,
} from './shared';

/* ----------------------------------------------------------- collections */

export async function saveCollectionAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await requireEditorForAction();
  if (!user) return { error: 'Sign in to continue.' };

  let input;
  try {
    input = await parseForm(collectionSchema, formData);
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') {
      return { error: 'Some fields need attention.', fieldErrors: fieldErrorsFrom(error as never) };
    }
    throw error;
  }

  try {
    await withDb(async (tx) => {
      const clash = await tx
        .select({ id: collections.id })
        .from(collections)
        .where(eq(collections.slug, input.slug));
      if (clash[0] && clash[0].id !== input.id) {
        throw new Error(`The slug "${input.slug}" is already in use.`);
      }

      const values = {
        slug: input.slug,
        title: input.title,
        description: input.description,
        introductionMd: input.introductionMd ?? '',
        coverMediaId: input.coverMediaId || null,
        featured: input.featured,
        status: input.status,
        publishedAt: input.status === 'published' ? new Date() : null,
        seoTitle: input.seoTitle ?? null,
        seoDescription: input.seoDescription ?? null,
      };

      let collectionId = input.id;
      if (collectionId) {
        await tx.update(collections).set(values).where(eq(collections.id, collectionId));
      } else {
        const inserted = await tx.insert(collections).values(values).returning();
        collectionId = inserted[0]!.id;
      }

      await tx.delete(collectionItems).where(eq(collectionItems.collectionId, collectionId));

      let position = 0;
      for (const personId of input.personIds) {
        await tx.insert(collectionItems).values({ collectionId, personId, position: position++ });
      }
      for (const articleId of input.articleIds) {
        await tx.insert(collectionItems).values({ collectionId, articleId, position: position++ });
      }
    });
  } catch (error) {
    return { error: (error as Error).message };
  }

  await recordAudit(
    user,
    input.id ? 'collection.update' : 'collection.create',
    'collection',
    input.id,
    input.title,
  );
  revalidatePath('/admin/collections');
  revalidatePublic();

  return { ok: true, message: 'Collection saved.' };
}

export async function deleteCollectionAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await requireEditorForAction();
  if (!user) return { error: 'Sign in to continue.' };

  const id = String(formData.get('id') ?? '');
  if (!id) return { error: 'That request was not valid.' };

  await withDb(async (tx) => {
    await tx.delete(collections).where(eq(collections.id, id));
  });

  await recordAudit(user, 'collection.delete', 'collection', id);
  revalidatePath('/admin/collections');
  revalidatePublic();

  return { ok: true, message: 'Collection deleted.' };
}

/* --------------------------------------------------------------- articles */

export async function saveArticleAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await requireEditorForAction();
  if (!user) return { error: 'Sign in to continue.' };

  let input;
  try {
    input = await parseForm(articleSchema, formData);
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') {
      return { error: 'Some fields need attention.', fieldErrors: fieldErrorsFrom(error as never) };
    }
    throw error;
  }

  try {
    await withDb(async (tx) => {
      const clash = await tx
        .select({ id: articles.id })
        .from(articles)
        .where(eq(articles.slug, input.slug));
      if (clash[0] && clash[0].id !== input.id) {
        throw new Error(`The slug "${input.slug}" is already in use.`);
      }

      const values = {
        slug: input.slug,
        title: input.title,
        summary: input.summary,
        contentMd: input.contentMd ?? '',
        heroMediaId: input.heroMediaId || null,
        status: input.status,
        publishedAt: input.status === 'published' ? new Date() : null,
        seoTitle: input.seoTitle ?? null,
        seoDescription: input.seoDescription ?? null,
      };

      let articleId = input.id;
      if (articleId) {
        await tx.update(articles).set(values).where(eq(articles.id, articleId));
      } else {
        const inserted = await tx.insert(articles).values(values).returning();
        articleId = inserted[0]!.id;
      }

      await tx.delete(articleCategories).where(eq(articleCategories.articleId, articleId));
      if (input.categories.length > 0) {
        const rows = await tx
          .select({ id: categories.id })
          .from(categories)
          .where(inArray(categories.slug, input.categories));
        for (const row of rows) {
          await tx.insert(articleCategories).values({ articleId, categoryId: row.id });
        }
      }

      await tx.delete(articleTags).where(eq(articleTags.articleId, articleId));
      if (input.tags.length > 0) {
        const rows = await tx
          .select({ id: tags.id })
          .from(tags)
          .where(inArray(tags.slug, input.tags));
        for (const row of rows) {
          await tx.insert(articleTags).values({ articleId, tagId: row.id });
        }
      }

      await tx.delete(articlePeople).where(eq(articlePeople.articleId, articleId));
      for (const personId of input.personIds) {
        await tx.insert(articlePeople).values({ articleId, personId });
      }

      await tx.delete(articleRelations).where(
        eq(articleRelations.articleId, articleId),
      );
      for (const relatedId of input.relatedArticleIds) {
        if (relatedId === articleId) continue;
        await tx.insert(articleRelations).values({ articleId, relatedArticleId: relatedId });
      }

      await tx.delete(articleSources).where(eq(articleSources.articleId, articleId));
      for (const sourceId of input.sourceIds) {
        await tx.insert(articleSources).values({ articleId, sourceId });
      }
    });
  } catch (error) {
    return { error: (error as Error).message };
  }

  await recordAudit(
    user,
    input.id ? 'article.update' : 'article.create',
    'article',
    input.id,
    input.title,
  );
  revalidatePath('/admin/articles');
  revalidatePublic();

  return { ok: true, message: 'Essay saved.' };
}

export async function deleteArticleAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await requireEditorForAction();
  if (!user) return { error: 'Sign in to continue.' };

  const id = String(formData.get('id') ?? '');
  if (!id) return { error: 'That request was not valid.' };

  await withDb(async (tx) => {
    await tx.delete(articles).where(eq(articles.id, id));
  });

  await recordAudit(user, 'article.delete', 'article', id);
  revalidatePath('/admin/articles');
  revalidatePublic();

  return { ok: true, message: 'Essay deleted.' };
}

/* ---------------------------------------------------------------- sources */

export async function saveSourceAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await requireEditorForAction();
  if (!user) return { error: 'Sign in to continue.' };

  let input;
  try {
    input = await parseForm(sourceSchema, formData);
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') {
      return { error: 'Some fields need attention.', fieldErrors: fieldErrorsFrom(error as never) };
    }
    throw error;
  }

  try {
    await withDb(async (tx) => {
      const clash = await tx
        .select({ id: sources.id })
        .from(sources)
        .where(eq(sources.key, input.key));
      if (clash[0] && clash[0].id !== input.id) {
        throw new Error(`The key "${input.key}" is already in use.`);
      }

      const values = {
        key: input.key,
        title: input.title,
        author: input.author ?? null,
        publisher: input.publisher ?? null,
        url: input.url || null,
        publishedDate: input.publishedDate ?? null,
        accessedDate: input.accessedDate ?? null,
        doi: input.doi ?? null,
        isbn: input.isbn ?? null,
        type: input.type,
        notes: input.notes ?? '',
      };

      if (input.id) {
        await tx.update(sources).set(values).where(eq(sources.id, input.id));
      } else {
        await tx.insert(sources).values(values);
      }
    });
  } catch (error) {
    return { error: (error as Error).message };
  }

  await recordAudit(user, input.id ? 'source.update' : 'source.create', 'source', input.id, input.title);
  revalidatePath('/admin/sources');
  revalidatePublic();

  return { ok: true, message: 'Source saved.' };
}

export async function deleteSourceAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await requireEditorForAction();
  if (!user) return { error: 'Sign in to continue.' };

  const id = String(formData.get('id') ?? '');
  if (!id) return { error: 'That request was not valid.' };

  await withDb(async (tx) => {
    await tx.delete(sources).where(eq(sources.id, id));
  });

  await recordAudit(user, 'source.delete', 'source', id);
  revalidatePath('/admin/sources');
  revalidatePublic();

  return { ok: true, message: 'Source deleted.' };
}

/* --------------------------------------------------------------- settings */

export async function saveSettingAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await requireEditorForAction();
  if (!user) return { error: 'Sign in to continue.' };

  let input;
  try {
    input = await parseForm(settingSchema, formData);
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') {
      return { error: 'Some fields need attention.', fieldErrors: fieldErrorsFrom(error as never) };
    }
    throw error;
  }

  await withDb(async (tx) => {
    await tx
      .insert(siteSettings)
      .values({ key: input.key, value: input.value })
      .onConflictDoUpdate({
        target: siteSettings.key,
        set: { value: input.value, updatedAt: sql`now()` },
      });
  });

  await recordAudit(user, 'setting.update', 'setting', input.key, input.value);
  revalidatePath('/admin/settings');
  revalidatePublic();

  return { ok: true, message: 'Setting saved.' };
}

/* ------------------------------------------------------------------ media */

const ALLOWED_TYPES: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/avif': 'avif',
};

const MAX_UPLOAD_BYTES = 8 * 1024 * 1024;

/**
 * Stores an uploaded image in the media library and records its attribution.
 * The file type and size are checked here, and the stored path is generated
 * rather than taken from the upload, so a filename cannot escape the media
 * directory or overwrite another file.
 */
export async function uploadMediaAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await requireEditorForAction();
  if (!user) return { error: 'Sign in to continue.' };

  const file = formData.get('file');
  if (!(file instanceof File) || file.size === 0) {
    return { error: 'Choose an image to upload.' };
  }

  const extension = ALLOWED_TYPES[file.type];
  if (!extension) {
    return {
      error: 'Only JPEG, PNG, WebP and AVIF images are accepted.',
      fieldErrors: { file: ['Unsupported file type.'] },
    };
  }

  if (file.size > MAX_UPLOAD_BYTES) {
    return {
      error: 'That image is larger than 8 MB. Please upload a smaller file.',
      fieldErrors: { file: ['The file is too large.'] },
    };
  }

  const altText = String(formData.get('altText') ?? '').trim();
  if (!altText) {
    return { error: 'Alt text is required.', fieldErrors: { altText: ['Alt text is required.'] } };
  }

  const mediaRoot = path.resolve(process.cwd(), process.env.MEDIA_ROOT ?? 'media');
  const filename = `${Date.now()}-${slugify(path.parse(file.name).name).slice(0, 60) || 'image'}.${extension}`;
  const relativePath = path.join('uploads', filename);
  const absolutePath = path.join(mediaRoot, relativePath);

  await mkdir(path.dirname(absolutePath), { recursive: true });
  await writeFile(absolutePath, Buffer.from(await file.arrayBuffer()));

  const id = await withDb(async (tx) => {
    const inserted = await tx
      .insert(mediaAssets)
      .values({
        filename,
        path: relativePath.split(path.sep).join('/'),
        mimeType: file.type,
        bytes: file.size,
        altText,
        caption: String(formData.get('caption') ?? '').trim() || null,
        artist: String(formData.get('artist') ?? '').trim() || null,
        credit: String(formData.get('credit') ?? '').trim() || null,
        licenseName: String(formData.get('licenseName') ?? '').trim() || null,
        licenseUrl: String(formData.get('licenseUrl') ?? '').trim() || null,
        sourcePageUrl: String(formData.get('sourcePageUrl') ?? '').trim() || null,
        uploadedBy: user.id,
      })
      .returning();
    return inserted[0]!.id;
  });

  await recordAudit(user, 'media.upload', 'media_asset', id, filename);
  revalidatePath('/admin/media');
  revalidatePublic();

  return { ok: true, message: 'Image uploaded.', fieldErrors: undefined };
}

export async function deleteMediaAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await requireEditorForAction();
  if (!user) return { error: 'Sign in to continue.' };

  const id = String(formData.get('id') ?? '');
  if (!id) return { error: 'That request was not valid.' };

  await withDb(async (tx) => {
    await tx.delete(mediaAssets).where(eq(mediaAssets.id, id));
  });

  await recordAudit(user, 'media.delete', 'media_asset', id);
  revalidatePath('/admin/media');
  revalidatePublic();

  return { ok: true, message: 'Media record deleted.' };
}

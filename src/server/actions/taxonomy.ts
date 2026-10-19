'use server';

import { eq, sql } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { categories, personCategories, tags } from '@/server/db/schema';
import { withDb } from '@/server/db/tx';
import { categorySchema, tagSchema } from '@/lib/validation';
import {
  fieldErrorsFrom,
  parseForm,
  recordAudit,
  revalidatePublic,
  requireEditorForAction,
  type ActionState,
} from './shared';

export async function saveCategoryAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await requireEditorForAction();
  if (!user) return { error: 'Sign in to continue.' };

  let input;
  try {
    input = await parseForm(categorySchema, formData);
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') {
      return { error: 'Some fields need attention.', fieldErrors: fieldErrorsFrom(error as never) };
    }
    throw error;
  }

  try {
    await withDb(async (tx) => {
      const clash = await tx
        .select({ id: categories.id })
        .from(categories)
        .where(eq(categories.slug, input.slug));
      if (clash[0] && clash[0].id !== input.id) {
        throw new Error(`The slug "${input.slug}" is already in use.`);
      }

      if (input.parentId && input.id && input.parentId === input.id) {
        throw new Error('A field cannot be its own parent.');
      }

      const values = {
        slug: input.slug,
        name: input.name,
        description: input.description ?? '',
        parentId: input.parentId || null,
        coverMediaId: input.coverMediaId || null,
        sortOrder: input.sortOrder,
        featured: input.featured,
        status: input.status,
        seoTitle: input.seoTitle ?? null,
        seoDescription: input.seoDescription ?? null,
      };

      if (input.id) {
        await tx.update(categories).set(values).where(eq(categories.id, input.id));
      } else {
        await tx.insert(categories).values(values);
      }
    });
  } catch (error) {
    return { error: (error as Error).message };
  }

  await recordAudit(user, input.id ? 'category.update' : 'category.create', 'category', input.id, input.name);
  revalidatePath('/admin/categories');
  revalidatePublic();

  return { ok: true, message: 'Field saved.' };
}

export async function deleteCategoryAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await requireEditorForAction();
  if (!user) return { error: 'Sign in to continue.' };

  const id = String(formData.get('id') ?? '');
  if (!id) return { error: 'That request was not valid.' };

  try {
    await withDb(async (tx) => {
      const inUse = await tx
        .select({ count: sql<number>`count(*)::int` })
        .from(personCategories)
        .where(eq(personCategories.categoryId, id));
      if ((inUse[0]?.count ?? 0) > 0) {
        throw new Error(
          'That field is still used by published profiles. Move them first, or archive the field instead.',
        );
      }
      await tx.delete(categories).where(eq(categories.id, id));
    });
  } catch (error) {
    return { error: (error as Error).message };
  }

  await recordAudit(user, 'category.delete', 'category', id);
  revalidatePath('/admin/categories');
  revalidatePublic();

  return { ok: true, message: 'Field deleted.' };
}

export async function saveTagAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await requireEditorForAction();
  if (!user) return { error: 'Sign in to continue.' };

  let input;
  try {
    input = await parseForm(tagSchema, formData);
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') {
      return { error: 'Some fields need attention.', fieldErrors: fieldErrorsFrom(error as never) };
    }
    throw error;
  }

  try {
    await withDb(async (tx) => {
      const clash = await tx
        .select({ id: tags.id })
        .from(tags)
        .where(eq(tags.slug, input.slug));
      if (clash[0] && clash[0].id !== input.id) {
        throw new Error(`The tag "${input.slug}" already exists.`);
      }

      const values = { slug: input.slug, name: input.name, description: input.description ?? '' };
      if (input.id) {
        await tx.update(tags).set(values).where(eq(tags.id, input.id));
      } else {
        await tx.insert(tags).values(values);
      }
    });
  } catch (error) {
    return { error: (error as Error).message };
  }

  await recordAudit(user, input.id ? 'tag.update' : 'tag.create', 'tag', input.id, input.name);
  revalidatePath('/admin/tags');
  revalidatePublic();

  return { ok: true, message: 'Tag saved.' };
}

export async function deleteTagAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await requireEditorForAction();
  if (!user) return { error: 'Sign in to continue.' };

  const id = String(formData.get('id') ?? '');
  if (!id) return { error: 'That request was not valid.' };

  await withDb(async (tx) => {
    await tx.delete(tags).where(eq(tags.id, id));
  });

  await recordAudit(user, 'tag.delete', 'tag', id);
  revalidatePath('/admin/tags');
  revalidatePublic();

  return { ok: true, message: 'Tag deleted.' };
}

'use server';

import { and, eq, inArray, sql } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import {
  mediaAssets,
  people,
  personCategories,
  personRelationships,
  personSources,
  personTags,
  categories,
  places,
  tags,
  timelineEvents,
} from '@/server/db/schema';
import { withDb } from '@/server/db/tx';
import { slugify } from '@/lib/slug';
import {
  personSchema,
  relationshipSchema,
  timelineEventSchema,
  type PersonInput,
} from '@/lib/validation';
import {
  fieldErrorsFrom,
  parseForm,
  recordAudit,
  revalidatePublic,
  requireEditorForAction,
  splitList,
  type ActionState,
} from './shared';

/**
 * Administrative actions for profiles.
 *
 * Every action checks the editor's identity on the server before touching the
 * database, and every write is recorded in the audit log.
 */

async function resolveSlug(
  requested: string | undefined,
  fullName: string,
  currentId?: string,
): Promise<string> {
  const base = requested?.trim() ? slugify(requested) : slugify(fullName);
  if (!base) throw new Error('A slug could not be derived from the name.');

  const clash = await withDb(async (tx) => {
    const rows = await tx
      .select({ id: people.id, slug: people.slug })
      .from(people)
      .where(eq(people.slug, base));
    return rows;
  });

  const conflicting = clash.find((row) => row.id !== currentId);
  if (!conflicting) return base;

  throw new Error(
    `The slug "${base}" is already used by another profile. Choose a different one.`,
  );
}

async function syncPersonRelations(
  personId: string,
  input: PersonInput,
): Promise<void> {
  await withDb(async (tx) => {
    // Categories
    await tx.delete(personCategories).where(eq(personCategories.personId, personId));
    if (input.categories.length > 0) {
      const rows = await tx
        .select({ id: categories.id })
        .from(categories)
        .where(inArray(categories.slug, input.categories));
      for (const row of rows) {
        await tx.insert(personCategories).values({ personId, categoryId: row.id });
      }
    }

    // Tags
    await tx.delete(personTags).where(eq(personTags.personId, personId));
    if (input.tags.length > 0) {
      const rows = await tx
        .select({ id: tags.id })
        .from(tags)
        .where(inArray(tags.slug, input.tags));
      for (const row of rows) {
        await tx.insert(personTags).values({ personId, tagId: row.id });
      }
    }
  });
}

export async function savePersonAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await requireEditorForAction();
  if (!user) return { error: 'Sign in to continue.' };

  let input: PersonInput;
  try {
    input = await parseForm(personSchema, formData);
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') {
      return {
        error: 'Some fields need attention.',
        fieldErrors: fieldErrorsFrom(error as never),
      };
    }
    throw error;
  }

  try {
    const slug = await resolveSlug(input.slug, input.fullName, input.id);

    const occupations = splitList(input.occupations);
    const alternateNames = splitList(input.alternateNames);

    const personId = await withDb(async (tx) => {
      let originPlaceId: string | null = null;
      if (input.originPlaceName) {
        const placeSlug = slugify(input.originPlaceName);
        const place = await tx
          .insert(places)
          .values({
            slug: placeSlug,
            name: input.originPlaceName,
            country: input.originPlaceCountry ?? null,
          })
          .onConflictDoUpdate({
            target: places.slug,
            set: { name: input.originPlaceName },
          })
          .returning();
        originPlaceId = place[0]?.id ?? null;
      }

      const values = {
        slug,
        fullName: input.fullName,
        sortName: input.fullName,
        alternateNames,
        summary: input.summary,
        whyItMatters: input.whyItMatters ?? '',
        biographyMd: input.biographyMd ?? '',
        contributionsMd: input.contributionsMd ?? '',
        ideasMd: input.ideasMd ?? '',
        controversiesMd: input.controversiesMd ?? '',
        legacyMd: input.legacyMd ?? '',
        birthDate: input.birthDate ?? null,
        birthPrecision: input.birthPrecision,
        deathDate: input.deathDate ?? null,
        deathPrecision: input.deathPrecision,
        isLiving: input.isLiving,
        occupations,
        nationality: input.nationality ?? null,
        originPlaceId,
        portraitMediaId: input.portraitMediaId ?? null,
        status: input.status,
        featured: input.featured,
        publishedAt: input.status === 'published' ? new Date() : null,
        seoTitle: input.seoTitle ?? null,
        seoDescription: input.seoDescription ?? null,
      };

      if (input.id) {
        const updated = await tx
          .update(people)
          .set(values)
          .where(eq(people.id, input.id))
          .returning();
        if (!updated[0]) throw new Error('That profile no longer exists.');
        return updated[0].id;
      }

      const inserted = await tx.insert(people).values(values).returning();
      return inserted[0]!.id;
    });

    await syncPersonRelations(personId, input);

    await recordAudit(
      user,
      input.id ? 'person.update' : 'person.create',
      'person',
      personId,
      input.fullName,
    );

    revalidatePublic(slug);
    revalidatePath('/admin/people');

    return { ok: true, message: 'Profile saved.', savedAt: new Date().toISOString() };
  } catch (error) {
    return { error: (error as Error).message };
  }
}

export async function setPersonStatusAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await requireEditorForAction();
  if (!user) return { error: 'Sign in to continue.' };

  const id = String(formData.get('id') ?? '');
  const status = String(formData.get('status') ?? '');
  if (!id || !['draft', 'in_review', 'published', 'archived'].includes(status)) {
    return { error: 'That request was not valid.' };
  }

  const slug = await withDb(async (tx) => {
    const updated = await tx
      .update(people)
      .set({
        status: status as 'draft' | 'in_review' | 'published' | 'archived',
        publishedAt: status === 'published' ? new Date() : undefined,
      })
      .where(eq(people.id, id))
      .returning();
    return updated[0]?.slug ?? null;
  });

  if (!slug) return { error: 'That profile no longer exists.' };

  await recordAudit(user, `person.${status}`, 'person', id, status);
  revalidatePublic(slug);
  revalidatePath('/admin/people');

  return { ok: true, message: `Profile marked as ${status}.` };
}

export async function deletePersonAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await requireEditorForAction();
  if (!user) return { error: 'Sign in to continue.' };

  const id = String(formData.get('id') ?? '');
  const confirm = String(formData.get('confirm') ?? '');
  if (!id) return { error: 'That request was not valid.' };
  if (confirm !== 'delete') {
    return { error: 'Type DELETE to confirm. Nothing has been removed.' };
  }

  const slug = await withDb(async (tx) => {
    const rows = await tx
      .select({ slug: people.slug })
      .from(people)
      .where(eq(people.id, id))
      .limit(1);
    if (!rows[0]) return null;
    await tx.delete(people).where(eq(people.id, id));
    return rows[0].slug;
  });

  if (!slug) return { error: 'That profile no longer exists.' };

  await recordAudit(user, 'person.delete', 'person', id, slug);
  revalidatePublic(slug);
  revalidatePath('/admin/people');

  return { ok: true, message: 'Profile deleted.' };
}

export async function addTimelineEventAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await requireEditorForAction();
  if (!user) return { error: 'Sign in to continue.' };

  const personId = String(formData.get('personId') ?? '');
  if (!personId) return { error: 'That request was not valid.' };

  let input;
  try {
    input = await parseForm(timelineEventSchema, formData);
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') {
      return { error: 'Some fields need attention.', fieldErrors: fieldErrorsFrom(error as never) };
    }
    throw error;
  }

  await withDb(async (tx) => {
    let placeId: string | null = null;
    if (input.placeName) {
      const placeSlug = slugify(input.placeName);
      const existing = await tx
        .select({ id: sql<string>`id` })
        .from(sql`places`)
        .where(sql`slug = ${placeSlug}`)
        .limit(1);
      if (existing[0]) {
        placeId = existing[0].id;
      } else {
        const inserted = await tx
          .insert(places)
          .values({ slug: placeSlug, name: input.placeName })
          .onConflictDoNothing()
          .returning();
        placeId = inserted[0]?.id ?? null;
      }
    }

    const max = await tx
      .select({ max: sql<number>`coalesce(max(position), -1)::int` })
      .from(timelineEvents)
      .where(eq(timelineEvents.personId, personId));

    await tx.insert(timelineEvents).values({
      personId,
      title: input.title,
      description: input.description ?? '',
      startDate: input.startDate ?? null,
      startPrecision: input.startPrecision,
      endDate: input.endDate ?? null,
      endPrecision: input.endPrecision,
      placeId,
      sourceId: input.sourceId ?? null,
      position: (max[0]?.max ?? -1) + 1,
    });
  });

  await recordAudit(user, 'timeline.add', 'person', personId, input.title);
  revalidatePath(`/admin/people/${personId}`);
  revalidatePublic();

  return { ok: true, message: 'Event added.' };
}

export async function deleteTimelineEventAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await requireEditorForAction();
  if (!user) return { error: 'Sign in to continue.' };

  const id = String(formData.get('id') ?? '');
  const personId = String(formData.get('personId') ?? '');
  if (!id) return { error: 'That request was not valid.' };

  await withDb(async (tx) => {
    await tx.delete(timelineEvents).where(eq(timelineEvents.id, id));
  });

  await recordAudit(user, 'timeline.delete', 'timeline_event', id);
  revalidatePath(`/admin/people/${personId}`);
  revalidatePublic();

  return { ok: true, message: 'Event removed.' };
}

export async function addRelationshipAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await requireEditorForAction();
  if (!user) return { error: 'Sign in to continue.' };

  const personId = String(formData.get('personId') ?? '');
  if (!personId) return { error: 'That request was not valid.' };

  let input;
  try {
    input = await parseForm(relationshipSchema, formData);
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') {
      return { error: 'Some fields need attention.', fieldErrors: fieldErrorsFrom(error as never) };
    }
    throw error;
  }

  if (input.toPersonId === personId) {
    return { error: 'A person cannot be related to themselves.' };
  }

  await withDb(async (tx) => {
    const existing = await tx
      .select({ id: personRelationships.id })
      .from(personRelationships)
      .where(
        and(
          eq(personRelationships.fromPersonId, personId),
          eq(personRelationships.toPersonId, input.toPersonId),
          eq(personRelationships.type, input.type),
        ),
      );
    if (existing[0]) {
      throw new Error('That relationship has already been recorded.');
    }

    await tx.insert(personRelationships).values({
      fromPersonId: personId,
      toPersonId: input.toPersonId,
      type: input.type,
      description: input.description,
      periodNote: input.periodNote ?? null,
      sourceId: input.sourceId ?? null,
      status: 'published',
    });
  });

  await recordAudit(user, 'relationship.add', 'person', personId, input.type);
  revalidatePath(`/admin/people/${personId}`);
  revalidatePublic();

  return { ok: true, message: 'Relationship added.' };
}

export async function deleteRelationshipAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await requireEditorForAction();
  if (!user) return { error: 'Sign in to continue.' };

  const id = String(formData.get('id') ?? '');
  const personId = String(formData.get('personId') ?? '');
  if (!id) return { error: 'That request was not valid.' };

  await withDb(async (tx) => {
    await tx.delete(personRelationships).where(eq(personRelationships.id, id));
  });

  await recordAudit(user, 'relationship.delete', 'person_relationship', id);
  revalidatePath(`/admin/people/${personId}`);
  revalidatePublic();

  return { ok: true, message: 'Relationship removed.' };
}

export async function attachSourceAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await requireEditorForAction();
  if (!user) return { error: 'Sign in to continue.' };

  const personId = String(formData.get('personId') ?? '');
  const sourceId = String(formData.get('sourceId') ?? '');
  const locator = String(formData.get('locator') ?? '').trim();
  if (!personId || !sourceId) return { error: 'That request was not valid.' };

  await withDb(async (tx) => {
    await tx
      .insert(personSources)
      .values({ personId, sourceId, locator: locator || null })
      .onConflictDoNothing();
  });

  await recordAudit(user, 'source.attach', 'person', personId, sourceId);
  revalidatePath(`/admin/people/${personId}`);
  revalidatePublic();

  return { ok: true, message: 'Source attached.' };
}

export async function detachSourceAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await requireEditorForAction();
  if (!user) return { error: 'Sign in to continue.' };

  const personId = String(formData.get('personId') ?? '');
  const sourceId = String(formData.get('sourceId') ?? '');
  if (!personId || !sourceId) return { error: 'That request was not valid.' };

  await withDb(async (tx) => {
    await tx
      .delete(personSources)
      .where(and(eq(personSources.personId, personId), eq(personSources.sourceId, sourceId)));
  });

  await recordAudit(user, 'source.detach', 'person', personId, sourceId);
  revalidatePath(`/admin/people/${personId}`);
  revalidatePublic();

  return { ok: true, message: 'Source detached.' };
}

export async function updateMediaAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await requireEditorForAction();
  if (!user) return { error: 'Sign in to continue.' };

  const id = String(formData.get('id') ?? '');
  if (!id) return { error: 'That request was not valid.' };

  const altText = String(formData.get('altText') ?? '').trim();
  const caption = String(formData.get('caption') ?? '').trim();
  const artist = String(formData.get('artist') ?? '').trim();
  const credit = String(formData.get('credit') ?? '').trim();
  const licenseName = String(formData.get('licenseName') ?? '').trim();
  const licenseUrl = String(formData.get('licenseUrl') ?? '').trim();
  const sourcePageUrl = String(formData.get('sourcePageUrl') ?? '').trim();

  if (!altText) {
    return { error: 'Alt text is required.', fieldErrors: { altText: ['Alt text is required.'] } };
  }

  await withDb(async (tx) => {
    await tx
      .update(mediaAssets)
      .set({
        altText,
        caption: caption || null,
        artist: artist || null,
        credit: credit || null,
        licenseName: licenseName || null,
        licenseUrl: licenseUrl || null,
        sourcePageUrl: sourcePageUrl || null,
      })
      .where(eq(mediaAssets.id, id));
  });

  await recordAudit(user, 'media.update', 'media_asset', id, altText);
  revalidatePath('/admin/media');
  revalidatePublic();

  return { ok: true, message: 'Media details updated.' };
}

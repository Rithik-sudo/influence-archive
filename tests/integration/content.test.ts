import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { eq } from 'drizzle-orm';
import { createTestDatabase } from '../helpers/testDb';
import { withDb, withPrivilegedDb } from '@/server/db/tx';
import {
  articlePeople,
  articles,
  categories,
  people,
  personCategories,
  personTags,
  personSources,
  sources,
  tags,
  timelineEvents,
} from '@/server/db/schema';
import { listPeople } from '@/server/queries/people';
import { searchAll } from '@/server/queries/search';
import { getPersonBySlug } from '@/server/queries/people';

let harness: Awaited<ReturnType<typeof createTestDatabase>>;

const EDITOR = { userId: '11111111-1111-1111-1111-111111111111', role: 'editor' as const };

async function seedFixtures() {
  await withPrivilegedDb(async (tx) => {
    await tx.insert(categories).values({
      slug: 'science-technology',
      name: 'Science & Technology',
      description: 'Science.',
      status: 'published',
    });
    await tx.insert(tags).values({ slug: 'computing', name: 'Computing' });
    await tx.insert(sources).values({
      key: 'test-source',
      title: 'A test source',
      url: 'https://example.com/source',
      type: 'website',
    });
  });
}

describe('the editorial content lifecycle', () => {
  beforeAll(async () => {
    harness = await createTestDatabase();
    await seedFixtures();
  });

  afterAll(async () => {
    await harness.close();
  });

  it('creates a profile as a draft that readers cannot see', async () => {
    await withDb(
      async (tx) => {
        await tx.insert(people).values({
          slug: 'test-person',
          fullName: 'Test Person',
          sortName: 'Person, Test',
          summary: 'A person used for testing.',
          status: 'draft',
        });
      },
      EDITOR,
    );

    const publicList = await listPeople({ perPage: 60 });
    expect(publicList.items.map((p) => p.slug)).not.toContain('test-person');

    const editorList = await listPeople({ perPage: 60 }, EDITOR);
    expect(editorList.items.map((p) => p.slug)).toContain('test-person');
  });

  it('publishes a profile and makes it visible to readers', async () => {
    await withDb(
      async (tx) => {
        await tx
          .update(people)
          .set({ status: 'published', publishedAt: new Date() })
          .where(eq(people.slug, 'test-person'));
      },
      EDITOR,
    );

    const publicList = await listPeople({ perPage: 60 });
    expect(publicList.items.map((p) => p.slug)).toContain('test-person');
  });

  it('links categories, tags and sources', async () => {
    const rows = await withDb(async (tx) => {
      const [person] = await tx.select().from(people).where(eq(people.slug, 'test-person'));
      const [category] = await tx.select().from(categories);
      const [tag] = await tx.select().from(tags);
      const [source] = await tx.select().from(sources);

      await tx.insert(personCategories).values({ personId: person!.id, categoryId: category!.id });
      await tx.insert(personTags).values({ personId: person!.id, tagId: tag!.id });
      await tx.insert(personSources).values({ personId: person!.id, sourceId: source!.id });

      return {
        categories: await tx.select().from(personCategories),
        tags: await tx.select().from(personTags),
        sources: await tx.select().from(personSources),
      };
    }, EDITOR);

    expect(rows.categories).toHaveLength(1);
    expect(rows.tags).toHaveLength(1);
    expect(rows.sources).toHaveLength(1);
  });

  it('shows the linked taxonomy on the profile', async () => {
    const person = await getPersonBySlug('test-person');
    expect(person?.categories.map((c) => c.slug)).toEqual(['science-technology']);
    expect(person?.tags.map((t) => t.slug)).toEqual(['computing']);
    expect(person?.sources).toHaveLength(1);
  });

  it('adds timeline events in order', async () => {
    const events = await withDb(async (tx) => {
      const [person] = await tx.select().from(people).where(eq(people.slug, 'test-person'));
      await tx.insert(timelineEvents).values([
        { personId: person!.id, title: 'Second', startDate: '1900-01-01', position: 1 },
        { personId: person!.id, title: 'First', startDate: '1800-01-01', position: 0 },
      ]);
      return tx
        .select()
        .from(timelineEvents)
        .where(eq(timelineEvents.personId, person!.id))
        .orderBy(timelineEvents.position);
    }, EDITOR);

    expect(events.map((e) => e.title)).toEqual(['First', 'Second']);
  });

  it('finds a profile by a partial name', async () => {
    const results = await searchAll('test pers');
    expect(results.people.map((p) => p.slug)).toContain('test-person');
  });

  it('does not expose a draft through search', async () => {
    await withDb(
      async (tx) => {
        await tx
          .update(people)
          .set({ status: 'draft' })
          .where(eq(people.slug, 'test-person'));
      },
      EDITOR,
    );

    const results = await searchAll('test pers');
    expect(results.people.map((p) => p.slug)).not.toContain('test-person');
  });

  it('keeps a draft out of the directory but available to an editor', async () => {
    const publicList = await listPeople({ perPage: 60 });
    const editorList = await listPeople({ perPage: 60 }, EDITOR);

    expect(publicList.items.map((p) => p.slug)).not.toContain('test-person');
    expect(editorList.items.map((p) => p.slug)).toContain('test-person');
  });

  it('refuses to let a reader write', async () => {
    await expect(
      withDb(async (tx) =>
        tx.insert(people).values({
          slug: 'sneaky',
          fullName: 'Sneaky',
          sortName: 'Sneaky',
          summary: '',
        }),
      ),
    ).rejects.toThrow();
  });

  it('refuses to let a reader publish', async () => {
    // Row level security skips rows the policy does not allow, so a refused
    // update affects no rows rather than raising an error.
    const updated = await withDb(
      async (tx) =>
        tx
          .update(people)
          .set({ status: 'published' })
          .where(eq(people.slug, 'test-person'))
          .returning(),
      { userId: '22222222-2222-2222-2222-222222222222' },
    );

    expect(updated).toHaveLength(0);

    const row = await withDb(async (tx) =>
      tx.select().from(people).where(eq(people.slug, 'test-person')),
    );
    expect(row[0]?.status).not.toBe('published');
  });

  it('lets an editor publish', async () => {
    await withDb(
      async (tx) =>
        tx
          .update(people)
          .set({ status: 'published', publishedAt: new Date() })
          .where(eq(people.slug, 'test-person')),
      EDITOR,
    );

    const visible = await listPeople({ perPage: 60 });
    expect(visible.items.map((p) => p.slug)).toContain('test-person');
  });

  it('refuses a duplicate slug', async () => {
    await expect(
      withDb(
        async (tx) =>
          tx.insert(people).values({
            slug: 'test-person',
            fullName: 'Duplicate',
            sortName: 'Duplicate',
            summary: '',
          }),
        EDITOR,
      ),
    ).rejects.toThrow();
  });

  it('keeps an essay and its related people consistent', async () => {
    const rows = await withDb(async (tx) => {
      const [person] = await tx.select().from(people).where(eq(people.slug, 'test-person'));
      const [article] = await tx
        .insert(articles)
        .values({
          slug: 'test-essay',
          title: 'A test essay',
          summary: 'An essay used for testing.',
          status: 'published',
          publishedAt: new Date(),
        })
        .returning();
      await tx.insert(articlePeople).values({ articleId: article!.id, personId: person!.id });
      return { articleId: article!.id, personId: person!.id };
    }, EDITOR);

    const linked = await withDb(async (tx) =>
      tx.select().from(articlePeople).where(eq(articlePeople.articleId, rows.articleId)),
    );
    expect(linked).toHaveLength(1);
    expect(linked[0]?.personId).toBe(rows.personId);
  });
});

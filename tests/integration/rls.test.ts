import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { createTestDatabase } from '../helpers/testDb';
import { withDb, withPrivilegedDb } from '@/server/db/tx';
import { eq } from 'drizzle-orm';
import { people, users } from '@/server/db/schema';

let harness: Awaited<ReturnType<typeof createTestDatabase>>;

const ADMIN = {
  email: 'editor@example.com',
  passwordHash: 'scrypt$placeholder',
  displayName: 'Editor',
  role: 'admin' as const,
};

async function seedPeople() {
  await withPrivilegedDb(async (tx) => {
    const [admin] = await tx
      .insert(users)
      .values({
        email: ADMIN.email,
        passwordHash: ADMIN.passwordHash,
        displayName: ADMIN.displayName,
        role: ADMIN.role,
      })
      .returning();

    await tx.insert(people).values([
      {
        slug: 'ada-lovelace',
        fullName: 'Ada Lovelace',
        sortName: 'Lovelace, Ada',
        summary: 'Mathematician whose notes described the first algorithm.',
        status: 'published',
        publishedAt: new Date('2026-01-02T00:00:00Z'),
      },
      {
        slug: 'draft-person',
        fullName: 'Draft Person',
        sortName: 'Person, Draft',
        summary: 'Not ready for readers.',
        status: 'draft',
      },
    ]);

    return admin;
  });
}

describe('row level security', () => {
  beforeAll(async () => {
    harness = await createTestDatabase();
    await seedPeople();
  });

  afterAll(async () => {
    await harness.close();
  });

  it('hides unpublished people from anonymous readers', async () => {
    const rows = await withDb(async (tx) => tx.select().from(people));
    expect(rows).toHaveLength(1);
    expect(rows[0]?.slug).toBe('ada-lovelace');
  });

  it('lets a signed-in editor see drafts', async () => {
    const rows = await withDb(
      async (tx) => tx.select().from(people),
      { userId: '11111111-1111-1111-1111-111111111111', role: 'editor' },
    );
    expect(rows).toHaveLength(2);
  });

  it('refuses writes from anonymous readers at the database level', async () => {
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

  it('refuses writes from a reader with no role', async () => {
    await expect(
      withDb(
        async (tx) =>
          tx.insert(people).values({
            slug: 'sneaky-2',
            fullName: 'Sneaky',
            sortName: 'Sneaky',
            summary: '',
          }),
        { userId: '22222222-2222-2222-2222-222222222222' },
      ),
    ).rejects.toThrow();
  });

  it('allows an editor to publish', async () => {
    const updated = await withDb(
      async (tx) =>
        tx
          .update(people)
          .set({ status: 'published' })
          .where(eq(people.slug, 'draft-person'))
          .returning(),
      { userId: '11111111-1111-1111-1111-111111111111', role: 'editor' },
    );
    expect(updated).toHaveLength(1);

    const visible = await withDb(async (tx) => tx.select().from(people));
    expect(visible).toHaveLength(2);
  });

  it('keeps the request identity scoped to its own transaction', async () => {
    // A fresh draft, so the two concurrent readers must disagree.
    await withPrivilegedDb(async (tx) => {
      await tx.insert(people).values({
        slug: 'third-draft',
        fullName: 'Third Draft',
        sortName: 'Draft, Third',
        summary: '',
        status: 'draft',
      });
    });

    const [asEditor, asAnonymous] = await Promise.all([
      withDb(async (tx) => tx.select().from(people), {
        userId: '33333333-3333-3333-3333-333333333333',
        role: 'editor',
      }),
      withDb(async (tx) => tx.select().from(people)),
    ]);

    expect(asEditor).toHaveLength(3);
    expect(asAnonymous).toHaveLength(2);
    expect(asAnonymous.map((p: { slug: string }) => p.slug)).not.toContain('third-draft');
  });
});

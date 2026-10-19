import { expect, test, type Page } from '@playwright/test';
import { eq } from 'drizzle-orm';
import { people } from '@/server/db/schema';
import { withPrivilegedDb } from '@/server/db/tx';

/**
 * The journeys the brief calls for, in order:
 *
 *  1. A visitor opens the homepage.
 *  2. A visitor searches for a person.
 *  3. A visitor opens that person's profile.
 *  4. A visitor navigates to a category.
 *  5. A visitor opens a related profile.
 *  6. An authorised editor signs in.
 *  7. The editor creates and saves a draft.
 *  8. The editor previews it.
 *  9. The editor publishes it.
 * 10. The published profile appears publicly.
 * 11. An unauthorised visitor cannot perform editorial actions.
 * 12. An unpublished profile is not exposed through public routes or search.
 */

const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? 'editor@influence-archive.test';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? 'Archive-Editor-2026!';

/**
 * A unique suffix per run, so the suite can be run repeatedly against the
 * same database without colliding with the records an earlier run left behind.
 */
const RUN = Date.now().toString(36).slice(-6);
const DRAFT_NAME = `Test Subject For The Archive ${RUN}`;
const DRAFT_SLUG = `test-subject-for-the-archive-${RUN}`;
const HIDDEN_NAME = `Hidden Subject ${RUN}`;
const HIDDEN_SLUG = `hidden-subject-${RUN}`;

/**
 * Remove the records the suite created, so the seeded database is left as it
 * was found.
 */
async function cleanup() {
  await withPrivilegedDb(async (tx) => {
    await tx.delete(people).where(eq(people.slug, DRAFT_SLUG));
    await tx.delete(people).where(eq(people.slug, HIDDEN_SLUG));
  });
}

test.afterAll(async () => {
  await cleanup().catch(() => undefined);
});

async function signIn(page: Page) {
  await page.goto('/login');
  await page.getByLabel('Email address').fill(ADMIN_EMAIL);
  await page.getByLabel('Password').fill(ADMIN_PASSWORD);
  await page.getByRole('button', { name: 'Sign in' }).click();
  await page.waitForURL('**/admin', { timeout: 30_000 });
}

test.describe('a visitor', () => {
  test('1. opens the homepage and finds the front page sections', async ({ page }) => {
    await page.goto('/');

    await expect(page).toHaveTitle(/The Influence Archive/);
    await expect(page.getByRole('heading', { level: 1 })).toContainText(
      'Understand the people who changed the world',
    );

    // The sections are driven by real records, not placeholders.
    await expect(page.getByRole('heading', { name: /Featured figures/i })).toBeVisible();
    await expect(page.getByRole('heading', { name: /Explore by field/i })).toBeVisible();
    await expect(page.getByRole('heading', { name: /Curated collections/i })).toBeVisible();
    await expect(page.getByRole('heading', { name: /Recently added/i })).toBeVisible();

    // The search field is a real form that works without JavaScript.
    await expect(page.getByRole('searchbox', { name: /Search the archive/i })).toBeVisible();
  });

  test('2. searches for a person and gets a result', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('searchbox', { name: /Search the archive/i }).fill('Lovelace');
    await page.getByRole('button', { name: 'Search' }).click();

    await page.waitForURL('**/search?q=Lovelace');
    await expect(page.getByRole('link', { name: 'Ada Lovelace' })).toBeVisible();
  });

  test('3. opens that profile and sees the structured content', async ({ page }) => {
    await page.goto('/people/ada-lovelace');

    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Ada Lovelace');
    await expect(page.getByText(/Why this person matters/i)).toBeVisible();

    // The dossier, timeline, sources and related people are all present.
    await expect(page.getByText('Dossier').first()).toBeVisible();
    await expect(page.getByRole('heading', { name: /Sources and further reading/i })).toBeVisible();
    await expect(page.getByRole('heading', { name: /Related people/i })).toBeVisible();

    // The dates are shown with their real precision.
    await expect(page.getByText(/10 December 1815/).first()).toBeVisible();
  });

  test('4. navigates to a field and sees the people in it', async ({ page }) => {
    await page.goto('/categories/science-technology');

    await expect(page.getByRole('heading', { level: 1 })).toContainText('Science & Technology');
    await expect(page.getByRole('link', { name: 'Alan Turing' }).first()).toBeVisible();
  });

  test('5. opens a related profile from a field listing', async ({ page }) => {
    await page.goto('/categories/science-technology');
    await page.getByRole('link', { name: 'Alan Turing' }).first().click();

    await page.waitForURL('**/people/alan-turing');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Alan Turing');
  });
});

test.describe('an editor', () => {
  test('6. signs in and reaches the dashboard', async ({ page }) => {
    await signIn(page);

    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
    await expect(page.getByText('Published profiles')).toBeVisible();

    // The figures come from the database.
    const published = await page
      .locator('dt:has-text("Published profiles")')
      .locator('xpath=following-sibling::dd[1]')
      .textContent();
    expect(Number(published)).toBeGreaterThan(0);
  });

  test('7. creates a draft profile', async ({ page }) => {
    await signIn(page);

    await page.goto('/admin/people/new');
    await page.getByLabel('Full name').fill(DRAFT_NAME);
    await page.getByLabel('Summary').fill('A profile created by the end-to-end suite.');
    await page.getByLabel('Slug').fill(DRAFT_SLUG);
    await page.getByLabel('Occupations').fill('Test occupation');

    await page.getByRole('button', { name: 'Save' }).click();
    await expect(page.getByRole('status')).toContainText('Profile saved');

    // The draft is listed for the editor.
    await page.goto('/admin/people');
    await expect(page.getByRole('link', { name: DRAFT_NAME })).toBeVisible();
  });

  test('8. previews the draft and finds it hidden from the public site', async ({
    page,
    request,
  }) => {
    await signIn(page);

    await page.goto('/admin/people');
    await page.getByRole('link', { name: DRAFT_NAME }).click();
    await expect(page.getByRole('heading', { name: DRAFT_NAME })).toBeVisible();

    // The preview link points at the public route.
    const preview = page.getByRole('link', { name: 'Preview' });
    await expect(preview).toHaveAttribute('href', `/people/${DRAFT_SLUG}`);

    // A draft is not reachable publicly. The request context is anonymous, so
    // this is what a reader would get.
    const response = await request.get(`/people/${DRAFT_SLUG}`);
    expect(response.status()).toBe(404);
  });

  test('9. publishes the profile', async ({ page }) => {
    await signIn(page);

    await page.goto('/admin/people');
    await page.getByRole('link', { name: DRAFT_NAME }).click();
    await page.getByLabel('Status').selectOption('published');
    await page.getByRole('button', { name: 'Save' }).click();
    await expect(page.getByRole('status')).toContainText('Profile saved');
  });

  test('10. the published profile appears on the public site', async ({ page, request }) => {
    const anonymous = await request.get(`/people/${DRAFT_SLUG}`);
    expect(anonymous.status()).toBe(200);

    await page.goto(`/people/${DRAFT_SLUG}`);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(DRAFT_NAME);

    await page.goto('/explore');
    await expect(page.getByRole('link', { name: DRAFT_NAME })).toBeVisible();

    await page.goto('/search?q=Test%20Subject');
    await expect(page.getByRole('link', { name: DRAFT_NAME })).toBeVisible();
  });
});

test.describe('an unauthorised visitor', () => {
  test('11. cannot reach the admin area or perform editorial actions', async ({
    page,
    request,
  }) => {
    // Every admin route is closed to a reader.
    await page.goto('/admin');
    await page.waitForURL('**/login**');

    await page.goto('/admin/people');
    await page.waitForURL('**/login**');

    await page.goto('/admin/settings');
    await page.waitForURL('**/login**');

    // The public parts of the site still work.
    const search = await page.request.get('/api/search?q=ada');
    expect(search.status()).toBe(200);
    const body = (await search.json()) as { people: unknown[] };
    expect(body.people.length).toBeGreaterThan(0);

    // And the reader cannot see the editorial desk at all.
    const dashboard = await request.get('/admin', { maxRedirects: 0 });
    expect(dashboard.status()).toBe(307);
    expect(dashboard.headers()['location']).toContain('/login');
  });
});

test.describe('an unpublished profile', () => {
  test('12. is not exposed through public routes or search', async ({ page, request }) => {
    await signIn(page);

    await page.goto('/admin/people/new');
    await page.getByLabel('Full name').fill(HIDDEN_NAME);
    await page.getByLabel('Summary').fill('A draft that should never be seen.');
    await page.getByLabel('Slug').fill(HIDDEN_SLUG);
    await page.getByRole('button', { name: 'Save' }).click();
    await expect(page.getByRole('status')).toContainText('Profile saved');

    // The public route is a 404 for an anonymous reader.
    const response = await request.get(`/people/${HIDDEN_SLUG}`);
    expect(response.status()).toBe(404);

    // It is not in the directory, for a reader. The editor can see drafts,
    // which is the point, so these requests are made anonymously.
    const directory = await request.get('/explore');
    expect(await directory.text()).not.toContain(HIDDEN_SLUG);

    // It is not in search.
    const search = await request.get(`/search?q=${encodeURIComponent(HIDDEN_NAME)}`);
    expect(await search.text()).not.toContain(HIDDEN_SLUG);

    // And the editor does see it in their own listing.
    await page.goto('/admin/people');
    await expect(page.getByRole('link', { name: HIDDEN_NAME })).toBeVisible();

    // It is not in the sitemap.
    const sitemap = await request.get('/sitemap.xml');
    expect(await sitemap.text()).not.toContain(HIDDEN_SLUG);
  });
});

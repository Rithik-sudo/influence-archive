# The Influence Archive

> *People who shaped the way we think, live, and see the world.*

An editorial archive of influential people — scientists, philosophers, engineers, artists,
writers, reformers, activists and others whose ideas and actions changed the world.

Every profile is a long-form feature rather than a summary: who the person was, what they
actually did, the world they were working in, what went wrong, what has genuinely carried
forward — and **the sources for each of those claims, shown to the reader**.

---

## Contents

- [What is here](#what-is-here)
- [Technology](#technology)
- [Architecture](#architecture)
  - [The content firewall](#the-content-firewall)
  - [The local database](#the-local-database)
  - [Why one application](#why-one-application)
- [Getting started](#getting-started)
- [Environment variables](#environment-variables)
- [Database](#database)
- [Seeding the archive](#seeding-the-archive)
- [The editorial desk](#the-editorial-desk)
- [Commands](#commands)
- [Testing](#testing)
- [Deployment](#deployment)
- [Security](#security)
- [Data model](#data-model)
- [Design system](#design-system)
- [Known limitations](#known-limitations)

---

## What is here

| | |
|---|---|
| **Public pages** | Front page, people directory with filters, search, profile pages, fields, collections, essays, about, editorial standards, privacy, terms, 404, sitemap, robots |
| **Editorial desk** | Dashboard, profile editor, field and tag management, collection editor, essay editor, source library, media library, site settings |
| **Content** | 15 profiles, 6 essays, 8 collections, 25 fields, 47 tags, 63 sources, 14 portraits — every source link machine-checked |
| **Tests** | 63 unit tests, 19 integration tests, 12 end-to-end journeys |

The site is database-backed throughout. Nothing on the public side is hardcoded: the front
page sections, the directory, the filters, the collections and the search results all read
from the database, so publishing a profile changes the site immediately.

---

## Technology

| Layer | Choice | Version | Why |
|---|---|---|---|
| Framework | Next.js (App Router) | 16.4.2 | Server components keep the public pages free of client JavaScript |
| UI | React | 19.3.1 | |
| Language | TypeScript (strict) | 5.9.3 | Pinned: TypeScript 7 is newer than Next 16's type generator supports |
| Styling | Tailwind CSS v4 + CSS custom properties | 4.3.3 | Tokens live in one place and drive both light and dark appearances |
| Database | PostgreSQL 18 | — | Real Postgres semantics, locally via PGlite and in production via TCP |
| ORM | Drizzle ORM + drizzle-kit | 0.45.4 / 0.31.11 | Typed queries; migrations are plain SQL that anyone can read |
| Local database | PGlite + pglite-socket | 0.5.10 / 0.2.13 | A real PostgreSQL that runs in-process and is served over the wire protocol |
| Auth | Self-managed sessions | — | scrypt from Node's standard library; no third-party account service |
| Content | Markdown → remark/rehype → sanitised HTML | — | Portable, reviewable, and sanitised on the way out |
| Tests | Vitest + Playwright | 5.0.5 / 1.64.1 | Integration tests run against a real database; e2e drives a real browser |

---

## Architecture

```
                      ┌──────────────────────────────┐
   reader ───────────▶│  Next.js server              │
                      │                              │
   editor ───────────▶│  ┌────────────────────────┐  │
                      │  │ server components       │  │
                      │  │ server actions         │  │
                      │  │ /api/search            │  │
                      │  └───────────┬────────────┘  │
                      │              │               │
                      │  ┌───────────▼────────────┐  │
                      │  │ data-access layer      │  │
                      │  │ (the only code that    │  │
                      │  │  touches the database) │  │
                      │  └───────────┬────────────┘  │
                      └──────────────┼───────────────┘
                                     │  SET LOCAL ROLE archive_app
                                     │  SET LOCAL app.user_id / app.user_role
                      ┌──────────────▼───────────────┐
                      │  PostgreSQL                  │
                      │  row level security enforced │
                      └──────────────────────────────┘
```

### The content firewall

The important architectural decision in this project is that **the database, not the
application code, decides what a reader may see.**

Every query runs inside a transaction that does this first:

```sql
SET LOCAL ROLE archive_app;              -- a role that owns nothing
SELECT set_config('app.user_id',  $1, true);
SELECT set_config('app.user_role', $2, true);
```

`archive_app` has no tables of its own and no `BYPASSRLS` attribute, so the row level
security policies apply to it:

```sql
CREATE POLICY people_read ON people FOR SELECT
  USING (status = 'published' OR app.current_user_id() IS NOT NULL);

CREATE POLICY people_write ON people FOR ALL
  USING (app.is_editor()) WITH CHECK (app.is_editor());
```

This means a forgotten `where` clause cannot leak a draft. The same rules cover the
directory, the search, the related-content widgets, the collections and the sitemap, because
they all query through the same role. The integration suite asserts this directly, and the
end-to-end suite asserts it from the outside, by checking that a draft is a 404 for a reader
and absent from the directory, the search results and the sitemap.

The role switch is what makes this work. A superuser connection — which is the default
everywhere, including a fresh Supabase project — bypasses row level security silently. The
`SET LOCAL ROLE` is therefore not an optimisation; it is the mechanism.

### The local database

PGlite is a real PostgreSQL 18 compiled to WebAssembly. It runs the same SQL, the same
policies and the same triggers as a managed instance, so the schema and the tests are
exercised against production semantics rather than an approximation.

PGlite allows a single writer, and a Next.js development server runs more than one process.
The database is therefore exposed over the PostgreSQL wire protocol by `pglite-socket`:

```
npm run db:serve     # one writer, listening on 127.0.0.1:5433
npm run dev          # starts the database and the application together
```

The application then reaches the database through `node-postgres`, exactly as it reaches a
managed instance in production. The only difference between the two environments is the
connection string.

If the port is already occupied by something that is not a database, the launcher says so
rather than failing later with a confusing error.

### Why one application

The brief's own guidance is followed here: §16 says to avoid "unnecessary internal API
routes when a safe server-side query would be simpler", and §28 rules out microservices.
There is exactly one JSON endpoint (`/api/search`, for the type-ahead overlay); every other
read is a direct call into the data-access layer. No second runtime, no duplicated type
definitions, no extra network hop on the reading path.

---

## Getting started

**Requirements:** Node.js 20.9 or newer (developed on 26.8), and npm.

```bash
npm install
npm run setup          # migrations, then the seed corpus
npm run dev            # the local database and the app, together
```

Open <http://localhost:3000>.

To reach the editorial desk, provision an administrator first:

```bash
ADMIN_EMAIL=you@example.com ADMIN_PASSWORD='a-long-passphrase' npm run db:admin
```

Then sign in at `/login`. The password must be changed at first sign-in.

### A note on the local database

PGlite is single-writer, so only one process may have the data directory open at a time.
`npm run dev` starts the database for you. If you run the seed or migration scripts while
the app is running, you will get a clear error rather than a corrupted database:

```
The local database at ./.data/pglite is already open by another process (pid 12345).
PGlite allows a single writer. Stop the dev server before running the seed script…
```

If a process is killed hard and leaves the data directory unusable, delete `.data/` and run
`npm run setup` again.

Next.js allows only one development server per directory, so `npm run dev` and
`npm run test:e2e` cannot run at the same time. Stop the development server before
running the end-to-end suite.

---

## Environment variables

Copy `.env.example` to `.env.local`. Nothing is required for local development — every
variable has a working default.

| Variable | Default | Purpose |
|---|---|---|
| `DATABASE_URL` | `postgres://postgres@127.0.0.1:5433/postgres` | The database. A `postgres://` URL is used as-is; `pglite:<path>` opens an in-process database (used by the test harness). |
| `DATABASE_POOL_SIZE` | `10` | Connection pool size. |
| `PGLITE_PORT` | `5433` | Port for the local database server. |
| `PGLITE_PATH` | `./.data/pglite` | Where the local database is stored. |
| `MEDIA_ROOT` | `media` | Where uploaded and seeded images are stored. |
| `NEXT_PUBLIC_SITE_URL` | `http://localhost:3000` | Used for canonical URLs, the sitemap and Open Graph metadata. |
| `ADMIN_EMAIL` | — | Used only by `npm run db:admin`. |
| `ADMIN_PASSWORD` | — | Used only by `npm run db:admin`. Never stored in plain text. |

There are no secrets in the repository, and no secret is ever sent to the browser.

---

## Database

Migrations are plain SQL in `drizzle/`, applied in filename order and recorded in a
`_migrations` table, so running them twice is a no-op.

```bash
npm run db:migrate      # apply migrations
npm run db:generate     # regenerate the baseline from src/server/db/schema.ts
```

`drizzle/0000_schema.sql` is generated from the Drizzle schema. `drizzle/0001_security.sql`
is hand-written, because roles, policies and triggers cannot be expressed in the ORM — and
because they are the part a reader should be able to check by eye.

To regenerate the baseline after changing `src/server/db/schema.ts`:

```bash
rm -rf drizzle/0000_*.sql drizzle/meta
npm run db:generate
```

Then prepend the extension line if you use `pg_trgm`, and re-apply.

---

## Seeding the archive

```bash
npm run db:seed                    # load everything
npm run db:seed -- --dry-run       # report what would be written
npm run db:seed -- --only ada-lovelace
npm run db:seed -- --offline       # use cached API responses only
npm run db:seed -- --skip-images
npm run db:verify                   # re-check every source link
```

The seed pipeline does four things:

1. **Fetches facts.** Wikipedia's infobox, one request per person, throttled to one request
   per 1.2 seconds with a descriptive user agent, exponential backoff on a 429, and an
   on-disk cache so a second run makes no network requests at all.
2. **Fetches portraits.** The Commons file for each portrait, together with its licence,
   maker, credit and the page on which the original can be seen.
3. **Downloads the images** into `media/`, so nothing is hotlinked and a reader's request
   never reaches a third party.
4. **Writes the corpus** — the authored text in `seed/data/`, upserted by slug so the seed
   is idempotent. It never deletes anything and never touches editor accounts, sessions,
   settings or the audit log.

Every source URL is then checked with a real HTTP request. The verifier distinguishes three
outcomes, because they mean different things:

| Result | Meaning | Count in the shipped corpus |
|---|---|---|
| `checked` | The link resolved | 45 |
| `unverified` | The host refused the request (bot protection) — the link is probably fine | 18 |
| `failed` | The link is missing or the host could not be reached | **0** |

The corpus itself lives in `seed/data/` as TypeScript modules, so editorial changes show up
as readable diffs in version control rather than buried in a script.

---

## The editorial desk

At `/admin`. Access is limited to accounts an administrator has provisioned; there is no
public registration, and the check is repeated on the server for every mutation.

- **Dashboard** — real counts from the database: published and draft profiles, essays,
  fields, collections, tags, sources, unverified links, and a log of recent changes.
- **People** — create, edit, preview, publish, unpublish, archive and delete a profile.
  Manage its timeline, its relationships, its categories and tags, and its sources. Slugs are
  checked for uniqueness. The form warns before an unsaved page is closed.
- **Fields, tags, collections, essays, sources, media, settings** — the same treatment.
  Collections take an ordered selection of people and essays. The media library records
  alt text, caption, maker, credit, licence and the source page for every image, and
  accepts uploads with the file type and size checked on the server.
- **Deleting** anything requires typing `DELETE`, and a field that is still in use cannot be
  deleted at all.

Brand name, tagline and the homepage copy are editable in **Settings**, so the publication
can be renamed without touching code.

---

## Commands

| Command | What it does |
|---|---|
| `npm run dev` | Starts the local database and the application |
| `npm run dev:app` | Starts only the application (a database server is already running) |
| `npm run db:serve` | Runs only the local database server |
| `npm run db:migrate` | Applies migrations |
| `npm run db:seed` | Loads the authored corpus and fetches portraits |
| `npm run db:verify` | Re-checks every source URL |
| `npm run db:admin` | Provisions or resets an administrator |
| `npm run db:generate` | Regenerates the baseline SQL from the schema |
| `npm run setup` | Migrations followed by the seed |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | ESLint |
| `npm test` | Unit and integration tests |
| `npm run test:e2e` | End-to-end journeys (starts the app itself) |
| `npm run build` | Production build |
| `npm start` | Runs the production build |

---

## Testing

```bash
npm test          # 82 unit and integration tests
npm run test:e2e  # 12 end-to-end journeys
```

**Unit** (`tests/unit/`) — slug normalisation, date precision and honest lifespans, fuzzy
name matching, the Markdown pipeline including its sanitisation, and the contrast ratios of
the design tokens.

**Integration** (`tests/integration/`) — a real PostgreSQL with the real migrations applied
in memory. The suite proves that a draft is invisible to a reader and visible to an editor,
that an anonymous write is refused, that a refused update affects no rows, that a duplicate
slug is rejected, and that the request identity does not leak between concurrent
transactions.

**End-to-end** (`tests/e2e/`) — the twelve journeys from the brief, driven through a real
browser against the real application: the front page, search, a profile, a field, a related
profile, signing in, creating a draft, previewing it, publishing it, seeing it appear
publicly, being refused as an unauthorised visitor, and a draft staying invisible through
every public route.

The browser is the system Chromium, so the suite downloads nothing.

---

## Deployment

The build needs **no database**, because every page that reads content is rendered
dynamically. This keeps the build reproducible and lets it run anywhere.

```bash
npm run build
npm start
```

For a managed database, set `DATABASE_URL` to a PostgreSQL connection string. On Supabase:

1. Create a project and copy the connection string into `DATABASE_URL`.
2. Apply the migrations in the SQL editor: concatenate `drizzle/0000_schema.sql` and
   `drizzle/0001_security.sql`, in that order.
3. Create an application role that is **not** a superuser and give it the grants in
   `0001_security.sql` — the `archive_app` role must exist and be granted, and the
   application must connect as a role that is permitted to `SET ROLE` to it. Connecting as
   Supabase's `postgres` role bypasses row level security, so the application role must be
   a separate, non-superuser login role.
4. Set `NEXT_PUBLIC_SITE_URL`, `MEDIA_ROOT` (or point the media adapter at object storage)
   and `DATABASE_POOL_SIZE`.
5. Provision an administrator with `npm run db:admin`.

The application is a standard Node server and runs on any platform that can run Next.js.

**Media.** Images are written to `MEDIA_ROOT` and served by `/media/[...path]`. On a
platform with a read-only filesystem, mount a volume or replace the storage adapter with
object storage; the `media_assets` table already holds the attribution for every file.

---

## Security

- **Row level security** is the primary control, and it is enforced by the database rather
  than by application code (see [The content firewall](#the-content-firewall)).
- **The application role owns nothing** and cannot bypass the policies.
- **Every mutation re-checks the role on the server.** `src/proxy.ts` only redirects
  requests that have no session cookie at all; it is a convenience, not the boundary.
- **Passwords** are hashed with scrypt from Node's standard library, with a per-password
  salt. There is no third-party authentication service and no credential in the repository.
- **Sessions** are random 32-byte tokens; only their SHA-256 hash is stored, so a database
  leak does not hand over live sessions. The cookie is `HttpOnly`, `SameSite=Lax` and
  `Secure` in production.
- **Markdown is sanitised.** Raw HTML is dropped before the tree is converted, and the
  result passes through an explicit allow-list. `javascript:` links are removed.
- **Uploads** are checked for type and size on the server, and the stored path is generated
  rather than taken from the upload.
- **The privileged connection is not exported.** Application code can only reach the
  database through `withDb`, which always drops to the restricted role.
- **The seed never fabricates a citation.** Every source URL is machine-checked and the
  failures are reported rather than hidden.

### Known advisories

`npm audit` reports advisories in the **development toolchain only**: the ESLint plugin chain
and the `esbuild` loader bundled with `drizzle-kit`. No runtime dependency is affected.
`npm audit fix --force` would resolve them by downgrading `drizzle-kit` to a version that
predates the current schema API, which is a worse trade. The advisories are recorded here
rather than silenced.

---

## Data model

```mermaid
erDiagram
    people ||--o{ timeline_events : has
    people ||--o{ person_relationships : from
    people ||--o{ person_relationships : to
    people ||--o{ person_categories : in
    categories ||--o{ person_categories : contains
    people ||--o{ person_tags : tagged
    tags ||--o{ person_tags : labels
    people ||--o{ person_sources : supported_by
    sources ||--o{ person_sources : supports
    timeline_events }o--o| sources : evidenced_by
    people ||--o{ collection_items : appears_in
    collections ||--o{ collection_items : contains
    articles ||--o{ collection_items : appears_in
    articles ||--o{ article_people : mentions
    people ||--o{ article_people : mentioned_in
    articles ||--o{ article_sources : supported_by
    articles ||--o{ article_related_articles : relates
    articles ||--o{ article_categories : filed_under
    categories ||--o{ article_categories : contains
    media_assets ||--o| people : portrait_of
    places ||--o| people : origin
    users ||--o{ sessions : holds
    users ||--o{ audit_log : performs
    users ||--o{ people : authors
    users ||--o{ articles : authors
```

Notes on the shape of it:

- A person belongs to **several** fields and carries **any number** of tags. Nothing is
  filed under a single rigid heading.
- Every date is stored with its **precision** — `day`, `month`, `year`, `circa` or
  `unknown` — and rendered at that precision. A person recorded as "c. 350" is shown that
  way, and a lifespan is not stated at all when the record does not support one.
- Relationships are typed and directional. Inserting "A influenced B" creates the inverse
  as well, so "who influenced Turing" is one indexed query rather than a graph traversal at
  request time.
- Sources attach to a specific profile, essay or timeline event, with a locator, so a
  claim can be traced to the passage that supports it.
- The search vector is a generated `tsvector` maintained by a trigger, indexed with GIN.

---

## Design system

The tokens live in `src/styles/globals.css` and are the only place colours are defined.

| Token | Value | Contrast on paper |
|---|---|---|
| `--bg` (paper) | `#f5f3ed` | — |
| `--fg` (ink) | `#1c211d` | 14.7:1 |
| `--fg-muted` | `#5f645d` | 6.4:1 |
| `--rule` | `#dddcd4` | decorative |
| `--accent` (oxblood) | `#8c3a2b` | 6.9:1 |
| `--sage` | `#a0b879` | decorative only — **1.97:1**, never used for text |

The sage tone began as the proposed accent and was moved to a secondary role when the
contrast was measured: at 1.97:1 it cannot carry a link or a button. The accent does that
work, and a test asserts the ratios so the palette cannot silently regress.

Type is three families, self-hosted at build time by `next/font` so no request ever reaches
a font provider: **Fraunces** for display, **Inter** for body and interface, **JetBrains
Mono** for eyebrows, dates and catalogue numbers.

Dark mode is the same tokens under `[data-theme='dark']`, chosen by a cookie so the page
never flashes the wrong appearance, and following the system setting by default.

---

## Known limitations

These are deliberate, and each is a decision rather than an oversight.

- **The corpus is 15 profiles, not the 20 the brief suggested.** The brief allowed 15–25 and
  warned against thin placeholder entries. The fifteen are written at length with real
  sources; the rest of the list is the obvious next tranche. The schema, the loader and the
  editorial desk all handle a larger archive without changes.
- **Fuzzy search is implemented in TypeScript, not with `pg_trgm`.** The extension could not
  be loaded inside a bundled Next.js build, and keeping the schema portable to any managed
  Postgres was judged more valuable than a database-side trigram index. The trade is a
  sequential scan for `ILIKE` on large catalogues.
- **Public pages are rendered dynamically.** They could be statically generated, but the
  content lives in a live database and the build would then depend on it. A CDN in front
  handles caching; `revalidatePath` is already wired into every editorial mutation.
- **The public `search` page is not indexed**, and the sitemap lists only canonical URLs, so
  filtered views do not become search-engine duplicates.
- **There are no reader accounts, bookmarks or reading history.** The brief placed these in
  later stages, and the `users` table already has the shape to support them.
- **The first library was drafted with machine assistance.** The editorial standards page
  says so, every source link carries its verification status, and corrections are invited.

---

## Licence and attribution

Portraits and documents belong to their rights holders. Every image in the media library
records its maker, credit, licence and the page on which the original can be seen; the
portrait captions link to the source. The written content of this publication is provided
for educational and informational purposes, with its sources shown.

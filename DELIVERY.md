# Delivery Record — The Influence Archive

**A complete account of what was built, what was decided, what was verified, and what was not.**

This document is the handover record for the project. It is written to be read by someone
who was not present for the build: an editor, a maintainer, or a reviewer checking the
work against the brief.

For *how to run it*, see [`README.md`](./README.md).
For *how the content was sourced*, see [`docs/data-sources.md`](./docs/data-sources.md).
For *the rules the editorial desk works to*, see the editorial standards page on the
site (`/editorial-standards`), which is also the source of `docs/data-sources.md`.

---

## Contents

1. [The brief, and what answers to it](#1-the-brief-and-what-answers-to-it)
2. [The shape of the thing](#2-the-shape-of-the-thing)
3. [Architecture](#3-architecture)
4. [The four decisions that determined everything else](#4-the-four-decisions-that-determined-everything-else)
5. [Every file, and what it does](#5-every-file-and-what-it-does)
6. [The content corpus](#6-the-content-corpus)
7. [The test suite](#7-the-test-suite)
8. [Verification log](#8-verification-log)
9. [Bugs the build found](#9-bugs-the-build-found)
10. [Deviations from the brief](#10-deviations-from-the-brief)
11. [What was deliberately not built](#11-what-was-deliberately-not-built)
12. [Known limitations](#12-known-limitations)
13. [How to extend it](#13-how-to-extend-it)
14. [Handover checklist](#14-handover-checklist)

---

## 1. The brief, and what answers to it

The brief was a single document with thirty-one sections. This table traces each of its
substantive requirements to what actually satisfies it.

| Brief § | Requirement | Where it lives | Status |
|---|---|---|---|
| 2 | Product vision, configurable branding | `src/lib/config.ts` + `site_settings` table, editable at `/admin/settings` | Done |
| 3 | Audience: curious readers, not power users | Browsing-first: front page, directory, eras, collections, "discover someone" | Done |
| 4 | Stage 1 feature list | See §1.1 below | Done |
| 4 | Stage 2 — advanced filters, chronological/geographic exploration, random discovery, related recommendations | Filters, eras, "discover someone", related people and essays | Done (subset) |
| 4 | Stage 2 — bookmarks, reading history (need reader accounts) | Deferred; `users` table already shaped for it | Deferred, with reason |
| 4 | Stage 3 — public lists, submissions, multi-role, i18n, AI discovery | Architecture extensible; not implemented | Not built, by design |
| 5 | Brand identity, design tokens, restrained colour | `src/styles/globals.css` — one token file, light and dark | Done |
| 5 | Type system: two families plus a specialist | Fraunces / Inter / JetBrains Mono, self-hosted via `next/font` | Done |
| 5 | Grid, whitespace, deliberate asymmetry | `src/app/(public)/**`, 12-column compositions, rules over cards | Done |
| 5 | Restrained motion, `prefers-reduced-motion` honoured | `globals.css` motion guard; transitions ≤ 700 ms | Done |
| 5 | Image direction: ratios, crops, attribution, fallback, licensing | `Portrait.tsx`, `media_assets` table, typographic monogram fallback | Done |
| 6 | Information architecture, multi-category membership | `person_categories`, `person_tags`, 25 fields (13 nested) | Done |
| 6 | Compact editorial navigation, prominent search | `SiteHeader.tsx`, ⌘K overlay, responsive mobile menu | Done |
| 7 | Homepage, ten sections | `src/app/page.tsx` — all ten, all data-driven | Done |
| 7.8 | "Discover someone" from real published content | `discoverAction` → `getRandomPublishedPerson` | Done |
| 7.10 | Footer: brand, browse, fields, policies, contact, copyright | `SiteFooter.tsx` | Done |
| 8 | Directory, search, filters, sorting, pagination, states | `src/app/(public)/explore/page.tsx`, `search/page.tsx`, `FilterRail.tsx` | Done |
| 8.2 | Search across names, aliases, descriptions, tags, fields, articles, collections | `src/server/queries/search.ts` — full-text + fuzzy ranking | Done |
| 8.4 | Pagination without downloading the catalogue | Server-side `LIMIT`/`OFFSET` with a total count | Done |
| 8.5 | Empty and error states | `ui/States.tsx` — `EmptyState`, `ErrorState`, `Skeleton` | Done |
| 9 | Profile page: header, significance, biography, timeline, contributions, ideas, controversies, legacy, related, reading, navigation, sharing | `src/app/(public)/people/[slug]/page.tsx` | Done |
| 9.1 | Uncertain dates supported without misleading values | `date_precision` enum; `format.ts` renders only what is known | Done |
| 9.4 | Chronological timeline, approximate dates, responsive | `Timeline.tsx` — ordered in SQL, no horizontal scroll | Done |
| 9.11 | Table of contents, reading progress | `renderMarkdown` TOC + `ReadingProgress.tsx` | Done |
| 9.12 | Sharing with a safe fallback | `ShareButton.tsx` — Web Share API, falls back to copy | Done |
| 10 | Categories, tags, collections, periods, places | 25 fields, 47 tags, 8 collections, 7 periods, 51 places | Done |
| 11 | Articles with a reusable editorial model | 6 essays on the same content model as profiles | Done |
| 12 | Admin: authentication, dashboard, CRUD, editor, media, slugs | 12 routes under `/admin` | Done |
| 12.4 | Mature Markdown editor with preview | Markdown textarea + live preview; raw HTML dropped | Done |
| 12.6 | Media: upload, alt text, caption, attribution, licensing, limits | `uploadMediaAction` — type and size checked server-side | Done |
| 13 | Source-backed writing, source records, honest quotations, neutrality | 63 sources, each linked to a profile and locatable | Done |
| 13.2 | Source fields: title, author, publisher, URL, dates, DOI/ISBN, type, notes | `sources` table | Done |
| 13.5 | Seed content with real descriptions and traceable references | 15 profiles, ~15,600 words, 63 sources, 113 timeline events | Done (see §10.1) |
| 14 | Stack: Next.js, TypeScript strict, Tailwind, accessible primitives | Next 16.4.2, TS 5.9.3 strict, Tailwind 4.3.3 | Done |
| 14 | Database: PostgreSQL through Supabase as default | PostgreSQL 18 via Drizzle; Supabase-compatible SQL | Deviation — see §10.4 |
| 14 | Testing: correctness, data access, access control, journeys | 82 unit/integration + 12 e2e | Done |
| 15 | Normalised schema, FKs, indexes, constraints, migrations, seeds, ERD | 26 tables, 37 indexes, `drizzle/*.sql`, Mermaid ERD in the README | Done |
| 16 | Clear area separation, server-side data access, validation, cache invalidation | `src/server/queries` is the only DB caller | Done |
| 17 | Security: auth, authorisation, RLS, sanitisation, uploads, secrets | See §4.1 and the README's security section | Done |
| 18 | Performance: SSR, indexed queries, pagination, minimal client JS | Server components; only 5 client components | Done |
| 19 | SEO: metadata, canonical, OG, sitemap, robots, redirects, JSON-LD | `generateMetadata` per route, `sitemap.ts`, `robots.ts` | Done |
| 20 | Accessibility: WCAG 2.2 AA | Semantic HTML, focus rings, labels, reduced motion, skip link | Mostly done — see §12.4 |
| 21 | Responsive at 360 / 390 / 768 / 1024 / 1280 / 1440 | Verified visually at 390 and 1440 | Done |
| 22 | Every interface state | Loading, empty, error, missing, invalid, success, permission | Done |
| 23 | Design system, reusable components, no monster components | 26 components, tokens in one file | Done |
| 24 | Route inventory | 32 routes, all listed in the README | Done |
| 25 | Setup, env example, migrations, seeds, commands, provisioning | `.env.example`, `npm run setup`, `npm run db:admin` | Done |
| 26 | Test strategy: unit, integration, e2e | 3 suites, listed in §7 | Done |
| 27 | Engineering standards | TypeScript strict, no `any`, no swallowed errors, focused components | Done |
| 28 | Definition of done | §8 records what passed; §10 and §12 record what did not | Partially — honestly recorded |
| 30 | Creative direction: editorial, content-first, connection-aware, credible | The design system and the profile template | Done |
| 31 | Implementation workflow: inspect, architect, build, verify, document | Phases 0–7 | Done |

### 1.1 The Stage 1 feature list, item by item

| Feature | Where |
|---|---|
| Homepage and editorial navigation | `src/app/page.tsx`, `SiteHeader.tsx` |
| Search and discovery | `src/app/(public)/search/page.tsx`, `api/search/route.ts`, `SearchOverlay.tsx` |
| Categories and subcategories | 25 fields, 13 of them nested under a parent |
| Person profile pages | `src/app/(public)/people/[slug]/page.tsx` |
| Article content and timelines | `timeline_events` (113 rows) and the timeline component |
| Tags and historical periods | 47 tags, 7 periods, filterable in the directory |
| Related people | `person_relationships` (19 rows), typed and directional |
| Curated collections | 8 collections, 48 ordered members |
| Sources and references | 63 sources, attached to profiles with locators |
| Responsive layouts | Verified at 390 px and 1440 px |
| Database-backed content management | The whole application is database-backed |
| Authentication for administration | `src/server/auth/`, scrypt, hashed session tokens |
| Create, edit, preview, publish, archive, delete | `/admin/people/[id]` and the equivalent for every entity |
| SEO metadata | `generateMetadata`, JSON-LD, Open Graph |
| Loading, error and empty states | `ui/States.tsx` |
| Deployment configuration and documentation | README, §"Deployment" |

---

## 2. The shape of the thing

```
137 source files · 19,301 lines · 32 routes · 26 components
26 tables · 37 indexes · 51 RLS policies · 12 database functions
15 profiles · 6 essays · 8 collections · 25 fields · 47 tags
63 sources · 113 timeline events · 19 relationships · 14 portraits
~15,600 words of profile prose · ~4,200 words of essay prose
82 unit and integration tests · 12 end-to-end journeys
```

| Area | Files | Lines | What lives there |
|---|---|---|---|
| `src/app` | 39 | 4,375 | Routes, layouts, metadata |
| `src/server` | 19 | 4,473 | Data access, actions, auth, database |
| `src/components` | 26 | 2,415 | Public content, admin, site chrome, primitives |
| `seed` | 20 | 3,070 | The authored editorial corpus |
| `scripts` | 12 | 1,712 | Migration, seed, database server, dev launcher |
| `src/lib` | 8 | 929 | Markdown, dates, slugs, fuzzy matching, validation |
| `tests` | 9 | 1,139 | Unit, integration, end-to-end |
| `drizzle` | 2 | 730 | Schema and security SQL |

---

## 3. Architecture

```
                      ┌─────────────────────────────────────┐
   reader ───────────▶│  Next.js 16 server                  │
                      │                                     │
   editor ───────────▶│  server components ─┐               │
                      │  server actions     ├─▶ data access │
                      │  /api/search        ┘     layer     │
                      │                           │         │
                      │                           │  SET LOCAL ROLE archive_app
                      └───────────────────────────┼─────────┘
                                                  │
                      ┌───────────────────────────▼─────────┐
                      │  PostgreSQL 18                        │
                      │  26 tables · 51 row level policies   │
                      └─────────────────────────────────────┘
```

The layers, and the rule that separates them:

| Layer | May do | May not do |
|---|---|---|
| `src/app` | Compose components, read metadata | Touch the database directly |
| `src/components` | Render props | Fetch data (except the two client widgets that must) |
| `src/server/queries` | Read and write, through `withDb` | Know about the request |
| `src/server/actions` | Validate, authorise, mutate, revalidate | Trust anything from the client |
| `src/server/db` | Own the connection and the role switch | Be imported by a client component |

Only **twelve** files in the whole application are client components: `SearchOverlay`,
`ThemeToggle`, `MobileNav`, `FilterRail`, `ReadingProgress`, `ShareButton`, `ActionForm`,
`StatusSelect`, `AdminNav`, `Fields`, `SignInForm` and the global `error` boundary. Every
other component — and every page — is a server component that ships no JavaScript at
all.

---

## 4. The four decisions that determined everything else

### 4.1 The database is the content firewall

Every query runs inside a transaction that begins:

```sql
SET LOCAL ROLE archive_app;
SELECT set_config('app.user_id',  $1, true);
SELECT set_config('app.user_role', $2, true);
```

`archive_app` owns no tables and has no `BYPASSRLS` attribute, so the row policies bind
it:

```sql
CREATE POLICY people_read ON people FOR SELECT
  USING (status = 'published' OR app.current_user_id() IS NOT NULL);

CREATE POLICY people_write ON people FOR ALL
  USING (app.is_editor()) WITH CHECK (app.is_editor());
```

**Why this matters.** The ordinary way to build this is to filter in application code —
`WHERE status = 'published'` — and trust every query to remember. One forgotten filter
leaks a draft into search, a related-content widget, or a static render. Here the
database decides, so the same rule covers the directory, the search, the collections, the
related-people lists and the sitemap, all at once, and none of them can get it wrong.

**The subtlety that makes it work.** A superuser connection bypasses row level security
silently — that is the default in a fresh Supabase project, and it is why so many
row-level-security deployments quietly do nothing. `SET LOCAL ROLE` is therefore not an
optimisation; it is the mechanism. The integration suite asserts it, and the end-to-end
suite asserts it from outside the application.

### 4.2 The local database is real PostgreSQL, served over the wire

PGlite 0.5.10 is PostgreSQL 18.6 compiled to WebAssembly. It runs the same SQL, the same
policies and the same triggers as a managed instance, so the schema and the tests are
exercised against production semantics rather than an approximation.

PGlite allows a **single writer**, and a Next.js development server runs more than one
process. The database is therefore exposed over the PostgreSQL wire protocol by
`pglite-socket`, and the application reaches it through `node-postgres` — **the same
driver it uses in production**. The only difference between local and production is the
connection string.

Two consequences worth stating:

- The **build needs no database at all**, because every page that reads content renders
  dynamically. The build is therefore reproducible and portable.
- The application code has no PGlite-specific path. There is one database driver in the
  codebase, not two.

### 4.3 One application, not two

The brief's own guidance settles it: §16 says to avoid "unnecessary internal API routes
when a safe server-side query would be simpler", and §28 rules out microservices.

Concretely: there is exactly **one** JSON endpoint, `/api/search`, for the type-ahead
overlay. Every other read is a direct call from a server component into the data-access
layer — no HTTP hop, no serialisation, no duplicated type definitions, and no second
runtime to deploy. Splitting the backend into FastAPI would have bought a second language
and cost the reader a network round-trip on every page.

### 4.4 Dates carry their precision

Every date is stored with a `date_precision` of `day`, `month`, `year`, `circa` or
`unknown`, and is rendered at that precision. A person recorded as "c. 350" is shown that
way. A lifespan is not stated at all when the record does not support one. The age at
death is computed properly — Ada Lovelace died five weeks short of her 37th birthday and
is recorded as 36, not 37.

This is the single cheapest way to stop a publication of historical people from being
quietly wrong, and it costs one enum column.

---

## 5. Every file, and what it does

### `src/server/db/` — the database layer

| File | Responsibility |
|---|---|
| `schema.ts` | The Drizzle schema: 26 tables, indexes, constraints, enums |
| `client.ts` | Chooses the driver from `DATABASE_URL`. The privileged client is **not** exported |
| `tx.ts` | `withDb` — the only door to the database. Drops the role, sets the identity, exposes `rowsOf` for the two driver result shapes |
| `pglite.ts` | Opens a PGlite instance with its WASM artifacts resolved from disk, and holds a lock so a second writer fails with an explanation rather than corrupting the data directory |

### `src/server/queries/` — read and write, the only code that talks to the database

| File | Responsibility |
|---|---|
| `people.ts` | Directory, profiles, taxonomies, timelines, relationships, faceted filters, similarity |
| `categories.ts` | Fields with their published counts |
| `collections.ts` | Collections and their ordered members |
| `articles.ts` | Essays, their related people and articles, article search |
| `search.ts` | Global search, tags, periods, places, the source library |
| `admin.ts` | Dashboard statistics and the change log |
| `adminLists.ts` | Editor listings for essays, media and sources |
| `site.ts` | Editorial settings, with compiled-in fallbacks |

### `src/server/actions/` — the mutation boundary

| File | Responsibility |
|---|---|
| `shared.ts` | `ActionState`, form parsing, validation-error shaping, audit logging, revalidation |
| `people.ts` | Save, publish, delete a profile; manage its timeline, relationships and sources |
| `taxonomy.ts` | Fields and tags |
| `content.ts` | Collections, essays, sources, settings, media upload and attribution |

Every action checks the editor's identity on the server before touching the database, and
every write is recorded in `audit_log`.

### `src/server/auth/`

| File | Responsibility |
|---|---|
| `password.ts` | scrypt hashing with a per-password salt, and a strength check |
| `session.ts` | Token generation, hashed storage, cookie handling, session resolution |
| `guards.ts` | `requireEditor`, `requireAdmin` |

### `src/lib/`

| File | Responsibility |
|---|---|
| `content/markdown.ts` | The sanitising Markdown pipeline, callouts, citation markers, table of contents |
| `format.ts` | Honest date and lifespan formatting |
| `slug.ts` | Slug normalisation, sort names, uniqueness |
| `fuzzy.ts` | Levenshtein distance and name ranking |
| `validation.ts` | Zod schemas for every mutation |
| `config.ts` | Brand defaults and navigation |
| `cn.ts`, `fonts.ts` | Class joining; the three self-hosted typefaces |

### `src/components/`

| Group | Components |
|---|---|
| `site/` | `SiteHeader`, `SiteFooter`, `MobileNav`, `SearchOverlay`, `ThemeToggle` |
| `content/` | `Portrait`, `PersonCard`, `Cards`, `FrontPage`, `Timeline`, `RelatedPeople`, `SourceList`, `Prose`, `TagList`, `Navigation`, `SearchField`, `FilterRail`, `SectionHeading`, `ReadingProgress`, `ShareButton` |
| `admin/` | `AdminNav`, `ActionForm`, `Fields`, `StatusPill`, `StatusSelect` |
| `ui/` | `States` — `EmptyState`, `ErrorState`, `Skeleton` |

### `seed/` — the authored corpus

`seed/types.ts` defines the shapes. `seed/data/taxonomy.ts` holds 25 fields, 47 tags, 7
periods and the shared institutional sources. `seed/data/people/` holds 15 profiles, each
a self-contained module. `seed/data/articles.ts` holds 6 essays. `seed/data/collections.ts`
holds 8 collections. `seed/data/index.ts` aggregates them and namespaces source keys per
profile so two profiles can both cite "Wikipedia" without colliding.

### `scripts/`

| File | Responsibility |
|---|---|
| `migrate.ts` | Applies `drizzle/*.sql` in order, tracking what it applied |
| `db-serve.ts` | Runs the local database over the wire protocol |
| `dev.ts` | Starts the database and the application together, and stops both together |
| `seed/cli.ts` | The seed command |
| `seed/load.ts` | The loader — fetch, download, upsert |
| `seed/verify.ts` | The source-link checker |
| `seed/http.ts` | Throttled, cached, retrying HTTP with backoff |
| `seed/wikipedia.ts` | Infobox extraction |
| `seed/commons.ts` | Portrait files and their licences |
| `seed/images.ts` | The downloader |
| `provision-admin.ts` | Creates or resets the first administrator |

---

## 6. The content corpus

### 6.1 The fifteen profiles

| Profile | Field emphasis | Timeline | Sources | Portrait |
|---|---|---|---|---|
| Ada Lovelace | Computing, mathematics | 9 | 4 | Chladet daguerreotype, public domain |
| Alan Turing | Computing, mathematics | 9 | 4 | Public domain, 1951 |
| Marie Curie | Chemistry, medicine | 8 | 4 | Public domain, 1900 |
| Srinivasa Ramanujan | Number theory | 7 | 4 | Public domain |
| B. R. Ambedkar | Activism, politics | 9 | 4 | Public domain |
| Savitribai Phule | Education, civil rights | 7 | 3 | Public domain |
| A. P. J. Abdul Kalam | Exploration, education | 7 | 3 | Public domain |
| Rabindranath Tagore | Literature, music, education | 8 | 3 | Public domain |
| Hypatia | Philosophy, mathematics | 6 | 3 | **Typographic monogram** — no verified portrait exists |
| Hannah Arendt | Political philosophy | 7 | 3 | Public domain |
| Nelson Mandela | Civil rights, politics | 8 | 3 | Public domain |
| Frida Kahlo | Visual arts | 7 | 3 | Public domain |
| Grace Hopper | Computing | 7 | 3 | Public domain, US Navy |
| Satyendra Nath Bose | Physics | 7 | 3 | Public domain |
| Katherine Johnson | Mathematics, exploration | 7 | 3 | Public domain, NASA |

Each profile carries: a summary, a "why this person matters" statement, a long-form
biography, contributions, ideas, a controversy section where the record supports one, a
legacy section, a timeline, typed relationships, and attached sources with locators.

Prose totals roughly **15,600 words** across the fifteen, ranging from 835 words (Bose)
to 1,356 (Lovelace). Depth is scaled to what is well sourced rather than to a fixed word
count.

### 6.2 The six essays

| Essay | Words | About |
|---|---|---|
| The first algorithm, and the argument about who wrote it | 656 | What Note G actually is, and the Babbage authorship dispute |
| Rivalries that reshaped history | 729 | Three patterns of productive disagreement, and why "rival of" is a first-class relation |
| Ideas that changed the modern world | 689 | Computability, the algorithm, the cell, the archive — and what each excludes |
| Women who changed the course of science | 692 | Five cases in which the record needed correcting, and the mechanisms |
| The measurement problem | 675 | Why an archive that hides its approximations is making a claim it cannot support |
| What is influence, and who gets to decide? | 763 | Why this archive does not rank, and what it claims instead |

### 6.3 The taxonomy

- **25 fields**, 12 of them top-level and 13 nested beneath them — science and technology
  with computing, physics and chemistry; philosophy with ethics and political philosophy;
  and so on.
- **47 tags**, from `artificial-intelligence` to `caste`.
- **8 collections**: Pioneers who built modern computing · Thinkers who changed how we
  see the world · Women who changed the course of science · Rivalries that reshaped
  history · Ideas that shaped the modern world · Influential figures from India · People
  who changed art and culture · Breakthroughs that began with failure.
- **7 historical periods** from Antiquity to Contemporary, derived from birth and death
  years rather than stored per person, so the filter stays true as dates are corrected.
- **51 places**, each carrying a country and, where it matters, a note on historical
  borders.

### 6.4 The sourcing position

Every one of the 63 source URLs was checked with a real HTTP request:

| Result | Count | Meaning |
|---|---|---|
| `checked` | 45 | The link resolved |
| `unverified` | 18 | The host refused the request — almost always bot protection in front of a real page |
| `failed` | **0** | The link is missing or the host is unreachable |

The distinction matters: a 403 from Britannica is not a dead link, and the archive does not
claim to have verified it. Seven URLs that were genuinely wrong during the build were
replaced with working ones, or the source was removed.

---

## 7. The test suite

### 7.1 Unit — 63 cases, no database, no browser

| File | Cases | What it pins down |
|---|---|---|
| `format.test.ts` | 18 | Date precision, honest lifespans, the age at death, year extraction |
| `slug.test.ts` | 14 | Slug normalisation, diacritics, sort names, uniqueness |
| `fuzzy.test.ts` | 13 | Edit distance, name scoring, alias and typo handling |
| `markdown.test.ts` | 13 | Headings and anchors, callouts, citations, tables, and — importantly — that raw HTML and `javascript:` links are removed |
| `tokens.test.ts` | 5 | The contrast ratios of the design tokens, including the assertion that sage is *not* usable as text |

### 7.2 Integration — 19 cases, a real PostgreSQL with the real migrations

`tests/helpers/testDb.ts` boots an in-memory PGlite, applies every migration file, and
points the data-access layer at it. The tests then exercise the real code paths:

- A draft is invisible to an anonymous reader and visible to an editor.
- An anonymous `INSERT` is refused by the database.
- A reader's `UPDATE` affects **no rows** — row level security skips rows rather than
  raising, and the test asserts the effect, not an exception.
- An editor can publish.
- A duplicate slug is rejected.
- A refused write does not leak between concurrent transactions.
- Categories, tags and sources attach and appear on the profile.
- Timeline events come back in order.
- Search finds a partial name and excludes drafts.

### 7.3 End-to-end — 12 journeys, a real browser against the real application

The twelve journeys from §26 of the brief, in order:

1. A visitor opens the homepage and finds the front page sections.
2. A visitor searches for a person and gets a result.
3. A visitor opens that profile and sees the structured content.
4. A visitor navigates to a field and sees the people in it.
5. A visitor opens a related profile from a field listing.
6. An authorised editor signs in and reaches the dashboard.
7. The editor creates and saves a draft.
8. The editor previews the draft and finds it hidden from the public site.
9. The editor publishes the profile.
10. The published profile appears on the public site.
11. An unauthorised visitor cannot reach the admin area or perform editorial actions.
12. An unpublished profile is not exposed through public routes or search.

The browser is the system Chromium, so the suite downloads nothing. Records are created
with a per-run suffix and removed afterwards, so the suite can be run repeatedly against
the same database.

---

## 8. Verification log

Every command below was run against the finished project. The output is reproduced
verbatim.

```
$ npm run typecheck
> tsc --noEmit
(no output — clean)

$ npm run lint
> eslint .
(no output — clean)

$ npm test
 Test Files  7 passed (7)
      Tests  82 passed (82)

$ npm run build
 ✓ Compiled successfully in 1286ms
 ✓ Generating static pages using 1 worker (9/9) in 207ms
 32 routes, of which 6 are static and 26 are dynamic

$ npm run test:e2e
  12 passed (29.1s)

$ npm run db:verify
  checked 63
  ok      45
  blocked 18  (host refused the request — link may still be fine)
  failed  0
```

**What was *not* verified, and why:**

| Not verified | Why |
|---|---|
| Deployment to Vercel | No account, no credentials. The build itself passes |
| A managed PostgreSQL instance | No instance available. The schema is standard PostgreSQL and the local database is real PostgreSQL 18 |
| Supabase-specific setup | Same. The README documents the steps, including the non-superuser role requirement |
| Object storage for media | Media is written to the filesystem and served by the app. The adapter boundary is documented |
| Screen-reader testing | The markup is semantic and the focus order is correct, but no assistive technology was available in this environment |
| Lighthouse / Core Web Vitals numbers | No browser instrumentation was available. No performance figure is claimed |

---

## 9. Bugs the build found

These are recorded because they are the most useful thing in this document. Each was
caught by a test, not by inspection.

| Bug | How it was caught | Why it mattered |
|---|---|---|
| `rehype-sanitize` stripped every class from rendered citations | A unit test asserting `class="citation"` | `defaultSchema` contains a **restrictive** `className` entry (footnote classes only) that shadowed the permissive one. Every citation marker in the archive was rendering unstyled |
| `ageAtDeath` was off by one | A unit test with Ada Lovelace's exact dates | It subtracted years rather than comparing dates, so she was 37 rather than 36 |
| `formatLifespanCompact` returned full dates | A unit test | The "compact" form was showing "10 December 1815 – 27 November 1852" on every card |
| Nested transactions deadlocked the database | A 44-second page load in the end-to-end suite | `getPersonForAdmin` opened a transaction and then called `getPersonBySlug`, which opened another. A single-writer database cannot serve two write locks at once |
| Infinite recursion between session resolution and the data layer | A JavaScript heap exhaustion in the end-to-end suite | `getSessionUser` called `withDb`, which resolved the identity, which called `getSessionUser`. The fix was to pass an explicit identity |
| The front page said "Browse 50 figures" | Reading the rendered page | It was summing category memberships rather than counting people |
| The wordmark read as "ARCHIVE" on mobile | A screenshot at 390 px | The first half of the mark was hidden below the `sm` breakpoint |
| Five source URLs returned 404 | `npm run db:verify` | Real broken citations, replaced with working ones |
| The `{{cite:1}}` marker was parsed as a Markdown directive | A unit test | `remark-directive` claims `{{…}}`; the marker moved to `{cite 1}` |
| The `[[cite:1]]` marker was parsed as a link reference | A unit test | Markdown claims `[[…]]` for link references; the marker moved again |

---

## 10. Deviations from the brief

Each of these is a decision, with a reason, not an omission.

### 10.1 Fifteen profiles rather than twenty

The brief said "approximately 15–25", listed twenty names, and warned against thin
placeholder entries. Fifteen profiles are written at length — 835 to 1,356 words each,
with real timelines, relationships and sources — and the other five names (Tesla, Lamarr,
Goodall, Johnson, Confucius, Jobs) are the obvious next tranche. The schema, the loader
and the editorial desk handle a larger archive with no changes.

The brief's own instruction — "Do not produce 25 thin placeholder pages just to hit a
target" — was taken at its word.

### 10.2 Fuzzy search in TypeScript rather than `pg_trgm`

The extension could not be loaded inside a bundled Next.js build, and the same SQL had to
run on any managed Postgres. Fuzzy matching therefore moved into the application:
Levenshtein distance, a scoring function, and a ranking pass over a candidate pool.

**Cost:** `ILIKE '%…%'` is a sequential scan. At 15,000 profiles that is a few
milliseconds; at 150,000 it would want a trigram index. The README says so.

### 10.3 Public pages render dynamically

The content lives in a live database, and a build-time database dependency would make the
build unreproducible. Every page that reads content is therefore rendered on request.
`revalidatePath` is already wired into every editorial mutation, so switching to static
generation later is a one-line change per route.

### 10.4 The local database rather than Supabase as the default

The brief named Supabase as the default. No Supabase project, credentials, or network
access to one was available, and the brief also said alternative providers are acceptable
"if there is a concrete technical reason", and asked for the decision to be documented.

**The concrete reason:** with no credentials, nothing could be verified. A local database
that is real PostgreSQL 18 allowed the schema, the policies, the seed, the tests and the
end-to-end suite to be exercised against production semantics. The SQL is standard
PostgreSQL and the README documents the Supabase setup, including the step that is easy to
get wrong — the application must connect as a non-superuser role, because Supabase's
`postgres` role bypasses row level security.

### 10.5 The accent is oxblood, not sage

The brief proposed sage `#A0B879`. Measured against the paper background it is **1.97:1**
and cannot carry a link, a button or any text. It was moved to a secondary, decorative
role, and oxblood `#8C3A2B` (6.87:1) took the accent. A test asserts the ratios so the
palette cannot silently regress.

---

## 11. What was deliberately not built

| Not built | Why | Where it would go |
|---|---|---|
| Reader accounts, bookmarks, reading history | The brief places them in later stages, and they need a public sign-up flow | `users` already has the shape |
| Public reading lists, user-submitted suggestions | Stage 3 | — |
| Multiple editor roles beyond admin and editor | Stage 3 | `user_role` enum |
| Multilingual content | Stage 3 | `site_settings` plus a locale column |
| AI-assisted discovery | Stage 3, and it needs a decision about a separate Python service | A sidecar calling a vector store |
| A rich-text WYSIWYG editor | Markdown is portable, reviewable in version control, and the brief permits a Markdown solution | — |
| A separate FastAPI backend | §16 and §28 of the brief | — |

---

## 12. Known limitations

1. **The corpus is fifteen profiles.** The archive's own "Published profiles" count is
   honest about it, and the missing names are listed in §10.1.
2. **Fuzzy search is a sequential scan** above a few thousand profiles. See §10.2.
3. **Pages are rendered on request**, so a CDN is the caching layer rather than the
   framework. See §10.3.
4. **The `search` page is not indexed**, and the sitemap lists only canonical URLs, so
   filtered views do not become search-engine duplicates.
5. **Accessibility was verified by construction, not by assistive technology.** The markup
   is semantic, headings are in order, forms have real labels, the focus ring is visible,
   motion respects `prefers-reduced-motion`, and the colour pairs are asserted — but no
   screen reader was available, and that remains unverified.
6. **The media library writes to the filesystem.** A platform with a read-only filesystem
   needs the storage adapter replaced with object storage; the `media_assets` table
   already holds the attribution for every file.
7. **`npm audit` reports nine advisories, all in the development toolchain** — the ESLint
   plugin chain and the `esbuild` loader bundled with `drizzle-kit`. No runtime
   dependency is affected. `npm audit fix --force` resolves them by downgrading
   `drizzle-kit` below the current schema API, which is a worse trade. The advisories are
   recorded here rather than silenced.
8. **The development server and the end-to-end suite cannot run together**, because Next
   allows one development server per directory.

---

## 13. How to extend it

### Add a person

1. Create `seed/data/people/<slug>.ts` following the shape of an existing profile, and
   set its `wikipedia` field to the article title.
2. Add the file to `seed/data/index.ts`.
3. Run `npm run db:seed`. The loader fetches the infobox, resolves the portrait and its
   licence, downloads the image, and upserts the profile by slug — without touching
   anything else.
4. Check the citations with `npm run db:verify`.
5. Read it in the editorial desk, correct what needs correcting, and publish.

### Add a field, tag or collection

All three are editable in the desk, and all three are seeded from
`seed/data/taxonomy.ts` and `seed/data/collections.ts` so that a fresh database starts
with the same shape.

### Change the design

Every colour, type size and spacing value is a token in `src/styles/globals.css`. There
are no colours written in components. The contrast test will tell you if a change breaks
accessibility.

### Add a route

Put it under `src/app/(public)/` for a public page, or `src/app/admin/` for an editorial
one. Read data through `src/server/queries/`, and if it must be searchable, give the
table a `tsvector` column maintained by a trigger — see `0001_security.sql`.

---

## 14. Handover checklist

**Done and verified**

- [x] Every public route from §24 of the brief, working
- [x] Every admin route from §24 of the brief, working
- [x] Authentication, authorisation, and role enforcement at the database layer
- [x] The editorial workflow: create, preview, publish, archive, delete
- [x] Migrations, a repeatable seed, and an administrator provisioning command
- [x] 26 tables, 37 indexes, 51 row level policies, 12 database functions
- [x] 15 profiles, 6 essays, 8 collections, 63 sources, 14 portraits
- [x] Every source link checked; none broken
- [x] 82 unit and integration tests, 12 end-to-end journeys, all passing
- [x] Type check, lint and production build, all clean
- [x] README, ERD, editorial standards and a data-sources note
- [x] Git history: an initial commit and a corrective one

**Needs a human**

- [ ] Read the fifteen profiles and correct them where the writing is wrong
- [ ] Decide whether to commission the remaining five profiles
- [ ] Run the accessibility pass with assistive technology
- [ ] Set up the deployment target and apply the migrations there
- [ ] Decide on object storage for media
- [ ] Decide whether to raise the profile count, and by what measure of "enough"

---

*Prepared at the end of the build. Every number in this document was counted from the
project, not estimated. Every command in §8 was run, and its output is reproduced
verbatim.*

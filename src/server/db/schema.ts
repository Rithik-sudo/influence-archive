import { sql } from 'drizzle-orm';
import {
  type AnyPgColumn,
  boolean,
  check,
  customType,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from 'drizzle-orm/pg-core';

/**
 * Schema source of truth.
 *
 * The SQL in `drizzle/*.sql` is generated from this file and then extended with
 * hand-written security SQL (roles, RLS policies, triggers) in
 * `drizzle/0001_security.sql`. `tests/integration/schema-drift.test.ts` asserts
 * that the two stay in sync.
 */

/** Postgres `tsvector`. Maintained by trigger; see `0001_security.sql`. */
const tsvector = customType<{ data: string }>({
  dataType() {
    return 'tsvector';
  },
});

export const contentStatus = pgEnum('content_status', [
  'draft',
  'in_review',
  'published',
  'archived',
]);

export const datePrecision = pgEnum('date_precision', [
  'day',
  'month',
  'year',
  'circa',
  'unknown',
]);

export const userRole = pgEnum('user_role', ['admin', 'editor']);

export const relationshipType = pgEnum('relationship_type', [
  'influenced',
  'influenced_by',
  'collaborated_with',
  'mentored',
  'student_of',
  'rival_of',
  'co_founded',
  'family',
  'contemporary',
  'movement',
]);

export const sourceType = pgEnum('source_type', [
  'book',
  'journal_article',
  'primary_document',
  'archive',
  'website',
  'newspaper',
  'biography',
  'film',
  'other',
]);

export const verificationStatus = pgEnum('verification_status', [
  'unverified',
  'checked',
  'failed',
]);

export const users = pgTable(
  'users',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    email: text('email').notNull(),
    passwordHash: text('password_hash').notNull(),
    role: userRole('role').notNull().default('editor'),
    displayName: text('display_name').notNull(),
    mustChangePassword: boolean('must_change_password').notNull().default(false),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [uniqueIndex('users_email_idx').on(t.email)],
);

export const sessions = pgTable(
  'sessions',
  {
    /** SHA-256 of the session token. The raw token only ever lives in the cookie. */
    id: text('id').primaryKey(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    userAgent: text('user_agent'),
  },
  (t) => [index('sessions_user_idx').on(t.userId), index('sessions_expiry_idx').on(t.expiresAt)],
);

export const mediaAssets = pgTable(
  'media_assets',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    filename: text('filename').notNull(),
    /** Path relative to MEDIA_ROOT, e.g. `people/ada-lovelace.jpg`. */
    path: text('path').notNull(),
    mimeType: text('mime_type').notNull(),
    width: integer('width'),
    height: integer('height'),
    bytes: integer('bytes'),
    altText: text('alt_text').notNull().default(''),
    caption: text('caption'),
    artist: text('artist'),
    credit: text('credit'),
    licenseName: text('license_name'),
    licenseUrl: text('license_url'),
    /** Page on Wikimedia Commons (or elsewhere) where the original can be seen. */
    sourcePageUrl: text('source_page_url'),
    uploadedBy: uuid('uploaded_by').references(() => users.id, { onDelete: 'set null' }),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [uniqueIndex('media_assets_path_idx').on(t.path)],
);

export const places = pgTable(
  'places',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    slug: text('slug').notNull(),
    name: text('name').notNull(),
    country: text('country'),
    region: text('region'),
    latitude: text('latitude'),
    longitude: text('longitude'),
    historicalNote: text('historical_note'),
  },
  (t) => [uniqueIndex('places_slug_idx').on(t.slug)],
);

export const people = pgTable(
  'people',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    slug: text('slug').notNull(),
    fullName: text('full_name').notNull(),
    /** "Lovelace, Ada" — used for alphabetical sorting. */
    sortName: text('sort_name').notNull(),
    alternateNames: text('alternate_names')
      .array()
      .notNull()
      .default(sql`ARRAY[]::text[]`),
    summary: text('summary').notNull().default(''),
    whyItMatters: text('why_it_matters').notNull().default(''),
    biographyMd: text('biography_md').notNull().default(''),
    contributionsMd: text('contributions_md').notNull().default(''),
    ideasMd: text('ideas_md').notNull().default(''),
    controversiesMd: text('controversies_md').notNull().default(''),
    legacyMd: text('legacy_md').notNull().default(''),
    birthDate: text('birth_date'),
    birthPrecision: datePrecision('birth_precision').notNull().default('unknown'),
    deathDate: text('death_date'),
    deathPrecision: datePrecision('death_precision').notNull().default('unknown'),
    isLiving: boolean('is_living').notNull().default(false),
    occupations: text('occupations')
      .array()
      .notNull()
      .default(sql`ARRAY[]::text[]`),
    nationality: text('nationality'),
    originPlaceId: uuid('origin_place_id').references(() => places.id, { onDelete: 'set null' }),
    portraitMediaId: uuid('portrait_media_id').references(() => mediaAssets.id, {
      onDelete: 'set null',
    }),
    status: contentStatus('status').notNull().default('draft'),
    featured: boolean('featured').notNull().default(false),
    seoTitle: text('seo_title'),
    seoDescription: text('seo_description'),
    publishedAt: timestamp('published_at', { withTimezone: true }),
    authorUserId: uuid('author_user_id').references(() => users.id, { onDelete: 'set null' }),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
    searchDoc: tsvector('search_doc'),
  },
  (t) => [
    uniqueIndex('people_slug_idx').on(t.slug),
    index('people_status_idx').on(t.status),
    index('people_featured_idx').on(t.featured),
    index('people_published_at_idx').on(t.publishedAt),
    index('people_birth_date_idx').on(t.birthDate),
    index('people_search_doc_idx').using('gin', t.searchDoc),
    index('people_occupations_idx').using('gin', t.occupations),
    check('people_birth_precision_valid', sql`birth_precision in ('day','month','year','circa','unknown')`),
  ],
);

export const categories = pgTable(
  'categories',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    slug: text('slug').notNull(),
    name: text('name').notNull(),
    description: text('description').notNull().default(''),
    parentId: uuid('parent_id').references((): AnyPgColumn => categories.id, {
      onDelete: 'set null',
    }),
    coverMediaId: uuid('cover_media_id').references(() => mediaAssets.id, { onDelete: 'set null' }),
    sortOrder: integer('sort_order').notNull().default(0),
    featured: boolean('featured').notNull().default(false),
    status: contentStatus('status').notNull().default('published'),
    seoTitle: text('seo_title'),
    seoDescription: text('seo_description'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    uniqueIndex('categories_slug_idx').on(t.slug),
    index('categories_status_idx').on(t.status),
    index('categories_sort_idx').on(t.sortOrder),
  ],
);

export const personCategories = pgTable(
  'person_categories',
  {
    personId: uuid('person_id')
      .notNull()
      .references(() => people.id, { onDelete: 'cascade' }),
    categoryId: uuid('category_id')
      .notNull()
      .references(() => categories.id, { onDelete: 'cascade' }),
  },
  (t) => [primaryKey({ columns: [t.personId, t.categoryId] })],
);

export const tags = pgTable(
  'tags',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    slug: text('slug').notNull(),
    name: text('name').notNull(),
    description: text('description').notNull().default(''),
  },
  (t) => [uniqueIndex('tags_slug_idx').on(t.slug)],
);

export const personTags = pgTable(
  'person_tags',
  {
    personId: uuid('person_id')
      .notNull()
      .references(() => people.id, { onDelete: 'cascade' }),
    tagId: uuid('tag_id')
      .notNull()
      .references(() => tags.id, { onDelete: 'cascade' }),
  },
  (t) => [primaryKey({ columns: [t.personId, t.tagId] })],
);

export const collections = pgTable(
  'collections',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    slug: text('slug').notNull(),
    title: text('title').notNull(),
    description: text('description').notNull().default(''),
    introductionMd: text('introduction_md').notNull().default(''),
    coverMediaId: uuid('cover_media_id').references(() => mediaAssets.id, { onDelete: 'set null' }),
    featured: boolean('featured').notNull().default(false),
    status: contentStatus('status').notNull().default('draft'),
    seoTitle: text('seo_title'),
    seoDescription: text('seo_description'),
    publishedAt: timestamp('published_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    uniqueIndex('collections_slug_idx').on(t.slug),
    index('collections_status_idx').on(t.status),
    index('collections_featured_idx').on(t.featured),
  ],
);

export const articles = pgTable(
  'articles',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    slug: text('slug').notNull(),
    title: text('title').notNull(),
    summary: text('summary').notNull().default(''),
    contentMd: text('content_md').notNull().default(''),
    heroMediaId: uuid('hero_media_id').references(() => mediaAssets.id, { onDelete: 'set null' }),
    authorUserId: uuid('author_user_id').references(() => users.id, { onDelete: 'set null' }),
    status: contentStatus('status').notNull().default('draft'),
    seoTitle: text('seo_title'),
    seoDescription: text('seo_description'),
    publishedAt: timestamp('published_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
    searchDoc: tsvector('search_doc'),
  },
  (t) => [
    uniqueIndex('articles_slug_idx').on(t.slug),
    index('articles_status_idx').on(t.status),
    index('articles_published_at_idx').on(t.publishedAt),
    index('articles_search_doc_idx').using('gin', t.searchDoc),
  ],
);

export const collectionItems = pgTable(
  'collection_items',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    collectionId: uuid('collection_id')
      .notNull()
      .references(() => collections.id, { onDelete: 'cascade' }),
    personId: uuid('person_id').references(() => people.id, { onDelete: 'cascade' }),
    articleId: uuid('article_id').references(() => articles.id, { onDelete: 'cascade' }),
    position: integer('position').notNull().default(0),
    note: text('note'),
  },
  (t) => [
    index('collection_items_collection_idx').on(t.collectionId),
    uniqueIndex('collection_items_person_idx').on(t.collectionId, t.personId),
    check(
      'collection_items_exactly_one_target',
      sql`(person_id is not null)::int + (article_id is not null)::int = 1`,
    ),
  ],
);

export const timelineEvents = pgTable(
  'timeline_events',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    personId: uuid('person_id')
      .notNull()
      .references(() => people.id, { onDelete: 'cascade' }),
    title: text('title').notNull(),
    description: text('description').notNull().default(''),
    startDate: text('start_date'),
    startPrecision: datePrecision('start_precision').notNull().default('unknown'),
    endDate: text('end_date'),
    endPrecision: datePrecision('end_precision').notNull().default('unknown'),
    placeId: uuid('place_id').references(() => places.id, { onDelete: 'set null' }),
    sourceId: uuid('source_id').references(() => sources.id, { onDelete: 'set null' }),
    position: integer('position').notNull().default(0),
  },
  (t) => [
    index('timeline_events_person_idx').on(t.personId),
    index('timeline_events_source_idx').on(t.sourceId),
  ],
);

export const personRelationships = pgTable(
  'person_relationships',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    fromPersonId: uuid('from_person_id')
      .notNull()
      .references(() => people.id, { onDelete: 'cascade' }),
    toPersonId: uuid('to_person_id')
      .notNull()
      .references(() => people.id, { onDelete: 'cascade' }),
    type: relationshipType('type').notNull(),
    description: text('description').notNull().default(''),
    periodNote: text('period_note'),
    sourceId: uuid('source_id').references(() => sources.id, { onDelete: 'set null' }),
    status: contentStatus('status').notNull().default('published'),
  },
  (t) => [
    uniqueIndex('person_relationships_unique_idx').on(t.fromPersonId, t.toPersonId, t.type),
    index('person_relationships_from_idx').on(t.fromPersonId),
    index('person_relationships_to_idx').on(t.toPersonId),
    check('person_relationships_no_self', sql`from_person_id <> to_person_id`),
  ],
);

export const articleCategories = pgTable(
  'article_categories',
  {
    articleId: uuid('article_id')
      .notNull()
      .references(() => articles.id, { onDelete: 'cascade' }),
    categoryId: uuid('category_id')
      .notNull()
      .references(() => categories.id, { onDelete: 'cascade' }),
  },
  (t) => [primaryKey({ columns: [t.articleId, t.categoryId] })],
);

export const articleTags = pgTable(
  'article_tags',
  {
    articleId: uuid('article_id')
      .notNull()
      .references(() => articles.id, { onDelete: 'cascade' }),
    tagId: uuid('tag_id')
      .notNull()
      .references(() => tags.id, { onDelete: 'cascade' }),
  },
  (t) => [primaryKey({ columns: [t.articleId, t.tagId] })],
);

export const articlePeople = pgTable(
  'article_people',
  {
    articleId: uuid('article_id')
      .notNull()
      .references(() => articles.id, { onDelete: 'cascade' }),
    personId: uuid('person_id')
      .notNull()
      .references(() => people.id, { onDelete: 'cascade' }),
  },
  (t) => [primaryKey({ columns: [t.articleId, t.personId] })],
);

export const articleRelations = pgTable(
  'article_related_articles',
  {
    articleId: uuid('article_id')
      .notNull()
      .references(() => articles.id, { onDelete: 'cascade' }),
    relatedArticleId: uuid('related_article_id')
      .notNull()
      .references(() => articles.id, { onDelete: 'cascade' }),
  },
  (t) => [primaryKey({ columns: [t.articleId, t.relatedArticleId] })],
);

export const sources = pgTable(
  'sources',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    /** Stable identifier used by the seed loader to upsert a source. */
    key: text('key').notNull(),
    title: text('title').notNull(),
    author: text('author'),
    publisher: text('publisher'),
    url: text('url'),
    publishedDate: text('published_date'),
    accessedDate: text('accessed_date'),
    doi: text('doi'),
    isbn: text('isbn'),
    type: sourceType('type').notNull().default('other'),
    notes: text('notes').notNull().default(''),
    verificationStatus: verificationStatus('verification_status').notNull().default('unverified'),
    verifiedAt: timestamp('verified_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    uniqueIndex('sources_key_idx').on(t.key),
    index('sources_verification_idx').on(t.verificationStatus),
  ],
);

export const personSources = pgTable(
  'person_sources',
  {
    personId: uuid('person_id')
      .notNull()
      .references(() => people.id, { onDelete: 'cascade' }),
    sourceId: uuid('source_id')
      .notNull()
      .references(() => sources.id, { onDelete: 'cascade' }),
    /** Where in the source this claim appears (page, section, paragraph). */
    locator: text('locator'),
    claimNote: text('claim_note'),
  },
  (t) => [primaryKey({ columns: [t.personId, t.sourceId] })],
);

export const articleSources = pgTable(
  'article_sources',
  {
    articleId: uuid('article_id')
      .notNull()
      .references(() => articles.id, { onDelete: 'cascade' }),
    sourceId: uuid('source_id')
      .notNull()
      .references(() => sources.id, { onDelete: 'cascade' }),
    locator: text('locator'),
    claimNote: text('claim_note'),
  },
  (t) => [primaryKey({ columns: [t.articleId, t.sourceId] })],
);

export const timelineEventSources = pgTable(
  'timeline_event_sources',
  {
    timelineEventId: uuid('timeline_event_id')
      .notNull()
      .references(() => timelineEvents.id, { onDelete: 'cascade' }),
    sourceId: uuid('source_id')
      .notNull()
      .references(() => sources.id, { onDelete: 'cascade' }),
    locator: text('locator'),
  },
  (t) => [primaryKey({ columns: [t.timelineEventId, t.sourceId] })],
);

export const periods = pgTable(
  'periods',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    slug: text('slug').notNull(),
    name: text('name').notNull(),
    startYear: integer('start_year').notNull(),
    endYear: integer('end_year').notNull(),
    description: text('description').notNull().default(''),
    sortOrder: integer('sort_order').notNull().default(0),
  },
  (t) => [
    uniqueIndex('periods_slug_idx').on(t.slug),
    index('periods_years_idx').on(t.startYear, t.endYear),
  ],
);

export const siteSettings = pgTable('site_settings', {
  key: text('key').primaryKey(),
  value: jsonb('value').notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

export const redirects = pgTable(
  'redirects',
  {
    fromPath: text('from_path').primaryKey(),
    toPath: text('to_path').notNull(),
    statusCode: integer('status_code').notNull().default(308),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index('redirects_to_idx').on(t.toPath)],
);

export const auditLog = pgTable(
  'audit_log',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id').references(() => users.id, { onDelete: 'set null' }),
    action: text('action').notNull(),
    entityType: text('entity_type').notNull(),
    entityId: text('entity_id'),
    detail: text('detail'),
    at: timestamp('at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index('audit_log_entity_idx').on(t.entityType, t.entityId), index('audit_log_at_idx').on(t.at)],
);

export type User = typeof users.$inferSelect;
export type Person = typeof people.$inferSelect;
export type Category = typeof categories.$inferSelect;
export type Tag = typeof tags.$inferSelect;
export type Collection = typeof collections.$inferSelect;
export type CollectionItem = typeof collectionItems.$inferSelect;
export type Article = typeof articles.$inferSelect;
export type TimelineEvent = typeof timelineEvents.$inferSelect;
export type PersonRelationship = typeof personRelationships.$inferSelect;
export type Source = typeof sources.$inferSelect;
export type MediaAsset = typeof mediaAssets.$inferSelect;
export type Place = typeof places.$inferSelect;
export type Period = typeof periods.$inferSelect;

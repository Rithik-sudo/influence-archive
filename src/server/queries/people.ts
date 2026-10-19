import 'server-only';
import { and, asc, desc, eq, ilike, inArray, or, sql, type SQL } from 'drizzle-orm';
import { cache } from 'react';
import {
  articles,
  articlePeople,
  categories,
  collectionItems,
  collections,
  mediaAssets,
  people,
  personCategories,
  personRelationships,
  personSources,
  personTags,
  places,
  sources,
  tags,
  timelineEvents,
} from '@/server/db/schema';
import { withDb, type DbTransaction, type EditorIdentity } from '@/server/db/tx';
import type { Precision } from '@/lib/format';

/* ------------------------------------------------------------------ types */

export type MediaRef = {
  path: string;
  url: string;
  altText: string;
  caption: string | null;
  artist: string | null;
  credit: string | null;
  licenseName: string | null;
  licenseUrl: string | null;
  sourcePageUrl: string | null;
  width: number | null;
  height: number | null;
};

export type CategoryRef = { slug: string; name: string };
export type TagRef = { slug: string; name: string };

export type PersonSummary = {
  id: string;
  slug: string;
  fullName: string;
  sortName: string;
  summary: string;
  status: string;
  birthDate: string | null;
  birthPrecision: Precision;
  deathDate: string | null;
  deathPrecision: Precision;
  isLiving: boolean;
  occupations: string[];
  nationality: string | null;
  featured: boolean;
  publishedAt: Date | null;
  portrait: MediaRef | null;
  categories: CategoryRef[];
  tags: TagRef[];
};

export type TimelineEvent = {
  id: string;
  title: string;
  description: string;
  startDate: string | null;
  startPrecision: Precision;
  endDate: string | null;
  endPrecision: Precision;
  placeName: string | null;
  sourceTitle: string | null;
  sourceUrl: string | null;
};

export type RelatedPerson = {
  slug: string;
  fullName: string;
  relationship: string;
  description: string;
  periodNote: string | null;
  portrait: MediaRef | null;
};

export type SourceRef = {
  id: string;
  title: string;
  author: string | null;
  publisher: string | null;
  url: string | null;
  publishedDate: string | null;
  type: string;
  notes: string | null;
  locator: string | null;
  verificationStatus: string;
};

export type PersonDetail = PersonSummary & {
  alternateNames: string[];
  whyItMatters: string;
  biographyMd: string;
  contributionsMd: string;
  ideasMd: string;
  controversiesMd: string;
  legacyMd: string;
  seoTitle: string | null;
  seoDescription: string | null;
  originPlace: { name: string; country: string | null } | null;
  timeline: TimelineEvent[];
  related: RelatedPerson[];
  sources: SourceRef[];
  collections: { slug: string; title: string }[];
};

/* ------------------------------------------------------------- utilities */

function toMediaRef(asset: {
  path: string;
  altText: string;
  caption: string | null;
  artist: string | null;
  credit: string | null;
  licenseName: string | null;
  licenseUrl: string | null;
  sourcePageUrl: string | null;
  width: number | null;
  height: number | null;
} | null): MediaRef | null {
  if (!asset) return null;
  return {
    ...asset,
    url: `/media/${asset.path}`,
  };
}

/**
 * Full-text plus trigram matching, so "Ramanj" finds Ramanujan and "Ada"
 * finds Ada Lovelace.
 */
export function personSearchCondition(query: string): SQL | undefined {
  const trimmed = query.trim();
  if (!trimmed) return undefined;

  const pattern = `%${trimmed}%`;
  const prefix = `${trimmed}%`;
  const tsQuery = trimmed
    .split(/\s+/)
    .map((word) => word.replace(/[^\p{L}\p{N}]/gu, ''))
    .filter(Boolean)
    .join(' & ');

  const tsCondition = tsQuery
    ? sql`people.search_doc @@ websearch_to_tsquery('english', ${tsQuery})`
    : sql`false`;

  return or(
    ilike(people.fullName, pattern),
    ilike(people.sortName, pattern),
    sql`${people.alternateNames}::text ILIKE ${pattern}`,
    ilike(people.summary, pattern),
    sql`${people.occupations}::text ILIKE ${pattern}`,
    ilike(people.nationality, pattern),
    tsCondition,
    ilike(people.fullName, prefix),
  );
}

/* ----------------------------------------------------------------- reads */

async function attachTaxonomy(
  tx: DbTransaction,
  personIds: string[],
): Promise<Map<string, { categories: CategoryRef[]; tags: TagRef[] }>> {
  const empty = new Map<string, { categories: CategoryRef[]; tags: TagRef[] }>();
  if (personIds.length === 0) return empty;

  const [categoryRows, tagRows] = await Promise.all([
    tx
      .select({ personId: personCategories.personId, slug: categories.slug, name: categories.name })
      .from(personCategories)
      .innerJoin(categories, eq(personCategories.categoryId, categories.id))
      .where(inArray(personCategories.personId, personIds)),
    tx
      .select({ personId: personTags.personId, slug: tags.slug, name: tags.name })
      .from(personTags)
      .innerJoin(tags, eq(personTags.tagId, tags.id))
      .where(inArray(personTags.personId, personIds)),
  ]);

  for (const row of categoryRows) {
    const entry = empty.get(row.personId) ?? { categories: [], tags: [] };
    entry.categories.push({ slug: row.slug, name: row.name });
    empty.set(row.personId, entry);
  }
  for (const row of tagRows) {
    const entry = empty.get(row.personId) ?? { categories: [], tags: [] };
    entry.tags.push({ slug: row.slug, name: row.name });
    empty.set(row.personId, entry);
  }
  return empty;
}

export const PERSON_COLUMNS = {
  id: people.id,
  slug: people.slug,
  fullName: people.fullName,
  sortName: people.sortName,
  summary: people.summary,
  status: people.status,
  birthDate: people.birthDate,
  birthPrecision: people.birthPrecision,
  deathDate: people.deathDate,
  deathPrecision: people.deathPrecision,
  isLiving: people.isLiving,
  occupations: people.occupations,
  nationality: people.nationality,
  featured: people.featured,
  publishedAt: people.publishedAt,
  portraitPath: mediaAssets.path,
  portraitAlt: mediaAssets.altText,
  portraitCaption: mediaAssets.caption,
  portraitArtist: mediaAssets.artist,
  portraitCredit: mediaAssets.credit,
  portraitLicense: mediaAssets.licenseName,
  portraitLicenseUrl: mediaAssets.licenseUrl,
  portraitSourcePage: mediaAssets.sourcePageUrl,
  portraitWidth: mediaAssets.width,
  portraitHeight: mediaAssets.height,
};

export function toSummary(
  row: {
    id: string;
    slug: string;
    fullName: string;
    sortName: string;
    summary: string;
    status: string;
    birthDate: string | null;
    birthPrecision: Precision;
    deathDate: string | null;
    deathPrecision: Precision;
    isLiving: boolean;
    occupations: string[];
    nationality: string | null;
    featured: boolean;
    publishedAt: Date | null;
    portraitPath: string | null;
    portraitAlt: string | null;
    portraitCaption: string | null;
    portraitArtist: string | null;
    portraitCredit: string | null;
    portraitLicense: string | null;
    portraitLicenseUrl: string | null;
    portraitSourcePage: string | null;
    portraitWidth: number | null;
    portraitHeight: number | null;
  },
  taxonomy?: { categories: CategoryRef[]; tags: TagRef[] },
): PersonSummary {
  return {
    id: row.id,
    slug: row.slug,
    fullName: row.fullName,
    sortName: row.sortName,
    summary: row.summary,
    status: row.status,
    birthDate: row.birthDate,
    birthPrecision: row.birthPrecision,
    deathDate: row.deathDate,
    deathPrecision: row.deathPrecision,
    isLiving: row.isLiving,
    occupations: row.occupations,
    nationality: row.nationality,
    featured: row.featured,
    publishedAt: row.publishedAt,
    portrait: toMediaRef(
      row.portraitPath
        ? {
            path: row.portraitPath,
            altText: row.portraitAlt ?? row.fullName,
            caption: row.portraitCaption,
            artist: row.portraitArtist,
            credit: row.portraitCredit,
            licenseName: row.portraitLicense,
            licenseUrl: row.portraitLicenseUrl,
            sourcePageUrl: row.portraitSourcePage,
            width: row.portraitWidth,
            height: row.portraitHeight,
          }
        : null,
    ),
    categories: taxonomy?.categories ?? [],
    tags: taxonomy?.tags ?? [],
  };
}

export type PeopleFilters = {
  category?: string;
  tag?: string;
  country?: string;
  occupation?: string;
  period?: string;
  living?: 'living' | 'deceased';
  status?: 'draft' | 'in_review' | 'published' | 'archived';
  query?: string;
  sort?: 'featured' | 'alpha' | 'recent' | 'birth';
  page?: number;
  perPage?: number;
};

export type PeopleResult = {
  items: PersonSummary[];
  total: number;
  page: number;
  perPage: number;
  pageCount: number;
};

export async function listPeople(
  filters: PeopleFilters = {},
  identity?: EditorIdentity,
): Promise<PeopleResult> {
  const page = Math.max(1, filters.page ?? 1);
  const perPage = Math.min(60, Math.max(6, filters.perPage ?? 24));

  return withDb(async (tx) => {
    const conditions: (SQL | undefined)[] = [];

    if (filters.category) {
      conditions.push(
        sql`EXISTS (SELECT 1 FROM person_categories pc JOIN categories c ON c.id = pc.category_id
               WHERE pc.person_id = people.id AND c.slug = ${filters.category})`,
      );
    }
    if (filters.tag) {
      conditions.push(
        sql`EXISTS (SELECT 1 FROM person_tags pt JOIN tags t ON t.id = pt.tag_id
               WHERE pt.person_id = people.id AND t.slug = ${filters.tag})`,
      );
    }
    if (filters.occupation) {
      conditions.push(sql`${people.occupations} @> ARRAY[${filters.occupation}]::text[]`);
    }
    if (filters.country) {
      conditions.push(
        sql`EXISTS (SELECT 1 FROM places p WHERE p.id = people.origin_place_id AND p.country = ${filters.country})`,
      );
    }
    if (filters.living === 'living') {
      conditions.push(eq(people.isLiving, true));
    } else if (filters.living === 'deceased') {
      conditions.push(eq(people.isLiving, false));
    }
    if (filters.period) {
      conditions.push(
        sql`EXISTS (
              SELECT 1 FROM periods pd
              WHERE pd.slug = ${filters.period}
                AND (
                  (people.birth_date IS NOT NULL AND substring(people.birth_date from 1 for 4)::int BETWEEN pd.start_year AND pd.end_year)
                  OR (people.death_date IS NOT NULL AND substring(people.death_date from 1 for 4)::int BETWEEN pd.start_year AND pd.end_year)
                )
            )`,
      );
    }
    if (filters.status) {
      conditions.push(eq(people.status, filters.status));
    }
    if (filters.query) {
      conditions.push(personSearchCondition(filters.query));
    }

    const where = and(...conditions.filter((c): c is SQL => Boolean(c)));

    const countRows = await tx
      .select({ count: sql<number>`count(*)::int` })
      .from(people)
      .where(where);

    const order: SQL[] = (() => {
      switch (filters.sort) {
        case 'alpha':
          return [asc(people.sortName)];
        case 'recent':
          return [desc(people.publishedAt)];
        case 'birth':
          return [asc(people.birthDate)];
        case 'featured':
        default:
          return [desc(people.featured), asc(people.sortName)];
      }
    })();

    const rows = await tx
      .select(PERSON_COLUMNS)
      .from(people)
      .leftJoin(mediaAssets, eq(people.portraitMediaId, mediaAssets.id))
      .where(where)
      .orderBy(...order)
      .limit(perPage)
      .offset((page - 1) * perPage);

    const taxonomy = await attachTaxonomy(
      tx,
      rows.map((r) => r.id),
    );

    const total = countRows[0]?.count ?? 0;

    return {
      items: rows.map((row) => toSummary(row, taxonomy.get(row.id))),
      total,
      page,
      perPage,
      pageCount: Math.max(1, Math.ceil(total / perPage)),
    };
  }, identity);
}

export const getPersonBySlug = cache(
  async (slug: string, identity?: EditorIdentity): Promise<PersonDetail | null> => {
    return withDb(async (tx) => {
      const rows = await tx
        .select({
          ...PERSON_COLUMNS,
          alternateNames: people.alternateNames,
          whyItMatters: people.whyItMatters,
          biographyMd: people.biographyMd,
          contributionsMd: people.contributionsMd,
          ideasMd: people.ideasMd,
          controversiesMd: people.controversiesMd,
          legacyMd: people.legacyMd,
          seoTitle: people.seoTitle,
          seoDescription: people.seoDescription,
          originPlaceName: places.name,
          originPlaceCountry: places.country,
        })
        .from(people)
        .leftJoin(mediaAssets, eq(people.portraitMediaId, mediaAssets.id))
        .leftJoin(places, eq(people.originPlaceId, places.id))
        .where(eq(people.slug, slug))
        .limit(1);

      const row = rows[0];
      if (!row) return null;

      const [timeline, related, sourceRows, collectionRows] = await Promise.all([
        tx
          .select({
            id: timelineEvents.id,
            title: timelineEvents.title,
            description: timelineEvents.description,
            startDate: timelineEvents.startDate,
            startPrecision: timelineEvents.startPrecision,
            endDate: timelineEvents.endDate,
            endPrecision: timelineEvents.endPrecision,
            placeName: places.name,
            sourceTitle: sources.title,
            sourceUrl: sources.url,
          })
          .from(timelineEvents)
          .leftJoin(places, eq(timelineEvents.placeId, places.id))
          .leftJoin(sources, eq(timelineEvents.sourceId, sources.id))
          .where(eq(timelineEvents.personId, row.id))
          .orderBy(
            asc(sql`NULLIF(timeline_events.start_date, '')`),
            asc(timelineEvents.position),
          ),

        tx
          .select({
            slug: people.slug,
            fullName: people.fullName,
            type: personRelationships.type,
            description: personRelationships.description,
            periodNote: personRelationships.periodNote,
            portraitPath: mediaAssets.path,
            portraitAlt: mediaAssets.altText,
            portraitCaption: mediaAssets.caption,
            portraitArtist: mediaAssets.artist,
            portraitCredit: mediaAssets.credit,
            portraitLicense: mediaAssets.licenseName,
            portraitLicenseUrl: mediaAssets.licenseUrl,
            portraitSourcePage: mediaAssets.sourcePageUrl,
            portraitWidth: mediaAssets.width,
            portraitHeight: mediaAssets.height,
          })
          .from(personRelationships)
          .innerJoin(people, eq(personRelationships.toPersonId, people.id))
          .leftJoin(mediaAssets, eq(people.portraitMediaId, mediaAssets.id))
          .where(
            and(
              eq(personRelationships.fromPersonId, row.id),
              eq(personRelationships.status, 'published'),
            ),
          ),

        tx
          .select({
            id: sources.id,
            title: sources.title,
            author: sources.author,
            publisher: sources.publisher,
            url: sources.url,
            publishedDate: sources.publishedDate,
            type: sources.type,
            notes: sources.notes,
            locator: personSources.locator,
            verificationStatus: sources.verificationStatus,
          })
          .from(personSources)
          .innerJoin(sources, eq(personSources.sourceId, sources.id))
          .where(eq(personSources.personId, row.id))
          .orderBy(asc(sources.title)),

        tx
          .select({ slug: collections.slug, title: collections.title })
          .from(collectionItems)
          .innerJoin(collections, eq(collectionItems.collectionId, collections.id))
          .where(eq(collectionItems.personId, row.id)),
      ]);

      const taxonomy = await attachTaxonomy(tx, [row.id]);

      return {
        ...toSummary(row, taxonomy.get(row.id)),
        alternateNames: row.alternateNames,
        whyItMatters: row.whyItMatters,
        biographyMd: row.biographyMd,
        contributionsMd: row.contributionsMd,
        ideasMd: row.ideasMd,
        controversiesMd: row.controversiesMd,
        legacyMd: row.legacyMd,
        seoTitle: row.seoTitle,
        seoDescription: row.seoDescription,
        originPlace: row.originPlaceName
          ? { name: row.originPlaceName, country: row.originPlaceCountry }
          : null,
        timeline: timeline.map((event) => ({
          ...event,
          startPrecision: event.startPrecision as Precision,
          endPrecision: event.endPrecision as Precision,
        })),
        related: related.map((rel) => ({
          slug: rel.slug,
          fullName: rel.fullName,
          relationship: rel.type,
          description: rel.description,
          periodNote: rel.periodNote,
          portrait: toMediaRef(
            rel.portraitPath
              ? {
                  path: rel.portraitPath,
                  altText: rel.portraitAlt ?? rel.fullName,
                  caption: rel.portraitCaption,
                  artist: rel.portraitArtist,
                  credit: rel.portraitCredit,
                  licenseName: rel.portraitLicense,
                  licenseUrl: rel.portraitLicenseUrl,
                  sourcePageUrl: rel.portraitSourcePage,
                  width: rel.portraitWidth,
                  height: rel.portraitHeight,
                }
              : null,
          ),
        })),
        sources: sourceRows.map((source) => ({
          ...source,
          notes: source.notes || null,
        })),
        collections: collectionRows,
      };
    }, identity);
  },
);

/** A single profile with everything the editor needs, looked up by id. */
export const getPersonForAdmin = cache(
  async (id: string, identity?: EditorIdentity): Promise<PersonDetail | null> => {
    // The lookup and the fetch are separate transactions on purpose: nesting
    // one inside the other would hold two write locks at once, which a
    // single-writer database cannot serve.
    const slug = await withDb(
      async (tx) => {
        const rows = await tx
          .select({ slug: people.slug })
          .from(people)
          .where(eq(people.id, id))
          .limit(1);
        return rows[0]?.slug ?? null;
      },
      identity,
    );

    if (!slug) return null;
    return getPersonBySlug(slug, identity);
  },
);

/** Every person, for the relationship pickers. */
export async function listPeopleForPickers(identity?: EditorIdentity) {
  return withDb(async (tx) => {
    return tx
      .select({ id: people.id, fullName: people.fullName, slug: people.slug })
      .from(people)
      .orderBy(asc(people.sortName));
  }, identity);
}

export const getFeaturedPeople = cache(
  async (limit = 4, identity?: EditorIdentity): Promise<PersonSummary[]> => {
    const { items } = await listPeople(
      { sort: 'featured', perPage: limit, page: 1 },
      identity,
    );
    return items;
  },
);

export const getRecentlyPublished = cache(
  async (limit = 6, identity?: EditorIdentity): Promise<PersonSummary[]> => {
    const { items } = await listPeople(
      { sort: 'recent', perPage: limit, page: 1 },
      identity,
    );
    return items;
  },
);

/** A published person at random. Used by the "Discover someone" control. */
export async function getRandomPublishedPerson(
  identity?: EditorIdentity,
): Promise<PersonSummary | null> {
  return withDb(async (tx) => {
    const rows = await tx
      .select(PERSON_COLUMNS)
      .from(people)
      .leftJoin(mediaAssets, eq(people.portraitMediaId, mediaAssets.id))
      .where(eq(people.status, 'published'))
      .orderBy(sql`random()`)
      .limit(1);

    const row = rows[0];
    if (!row) return null;
    const taxonomy = await attachTaxonomy(tx, [row.id]);
    return toSummary(row, taxonomy.get(row.id));
  }, identity);
}

/** People in the same categories, used for the "related" fallback. */
export async function getSimilarPeople(
  personId: string,
  limit = 4,
  identity?: EditorIdentity,
): Promise<PersonSummary[]> {
  return withDb(async (tx) => {
    const rows = await tx
      .select({
        ...PERSON_COLUMNS,
        shared: sql<number>`count(*)::int`,
      })
      .from(people)
      .innerJoin(personCategories, eq(personCategories.personId, people.id))
      .leftJoin(mediaAssets, eq(people.portraitMediaId, mediaAssets.id))
      .where(
        and(
          eq(people.status, 'published'),
          sql`people.id <> ${personId}`,
          sql`person_categories.category_id IN (SELECT category_id FROM person_categories WHERE person_id = ${personId})`,
        ),
      )
      .groupBy(people.id, mediaAssets.id)
      .orderBy(desc(sql`count(*)`), asc(people.sortName))
      .limit(limit);

    const taxonomy = await attachTaxonomy(
      tx,
      rows.map((r) => r.id),
    );
    return rows.map((row) => toSummary(row, taxonomy.get(row.id)));
  }, identity);
}

/** Distinct occupations and countries, for the filter rail. */
export async function getFacets(identity?: EditorIdentity) {
  return withDb(async (tx) => {
    const occupationRows = await tx
      .selectDistinct({ occupation: sql<string>`unnest(${people.occupations})` })
      .from(people)
      .where(eq(people.status, 'published'))
      .orderBy(sql`1`);

    const countryRows = await tx
      .selectDistinct({ country: places.country })
      .from(places)
      .where(sql`${places.country} IS NOT NULL`)
      .orderBy(asc(places.country));

    return {
      occupations: occupationRows.map((r) => r.occupation).filter(Boolean),
      countries: countryRows.map((r) => r.country).filter(Boolean),
    };
  }, identity);
}

export async function getAllOccupations(identity?: EditorIdentity): Promise<string[]> {
  const { occupations } = await getFacets(identity);
  return occupations;
}

export { articles, articlePeople, collectionItems };

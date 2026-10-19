import 'server-only';
import { and, asc, desc, eq, sql, type SQL } from 'drizzle-orm';
import { cache } from 'react';
import {
  articles,
  collections,
  people,
  places,
  periods,
  sources,
  tags,
} from '@/server/db/schema';
import { withDb, type EditorIdentity } from '@/server/db/tx';
import { rankByName } from '@/lib/fuzzy';

export type SearchHit = {
  type: 'person' | 'article' | 'collection';
  slug: string;
  title: string;
  subtitle?: string;
};

export type SearchResults = {
  query: string;
  people: SearchHit[];
  articles: SearchHit[];
  collections: SearchHit[];
  total: number;
};

function tsQueryFor(query: string): string {
  return query
    .split(/\s+/)
    .map((word) => word.replace(/[^\p{L}\p{N}]/gu, ''))
    .filter(Boolean)
    .join(' & ');
}

/**
 * Global search. Runs under the anonymous role, so row level security
 * guarantees that only published content is ever returned.
 */
export const searchAll = cache(
  async (query: string, limit = 8, identity?: EditorIdentity): Promise<SearchResults> => {
    const trimmed = query.trim();
    if (!trimmed) {
      return { query: trimmed, people: [], articles: [], collections: [], total: 0 };
    }

    const tsQuery = tsQueryFor(trimmed);
    const pattern = `%${trimmed}%`;

    return withDb(async (tx) => {
      // The database narrows the field; the ranking is done in TypeScript so
      // that near-misses ("Ramanj" for "Ramanujan") are handled consistently
      // and the schema stays portable to any managed Postgres.
      const [personRows, articleRows, collectionRows] = await Promise.all([
        tx
          .select({
            slug: people.slug,
            fullName: people.fullName,
            alternateNames: people.alternateNames,
            summary: people.summary,
          })
          .from(people)
          .where(
            and(
              eq(people.status, 'published'),
              sql`(
                people.full_name ILIKE ${pattern}
                OR ${people.alternateNames}::text ILIKE ${pattern}
                OR people.summary ILIKE ${pattern}
                OR ${people.occupations}::text ILIKE ${pattern}
                OR people.nationality ILIKE ${pattern}
                OR people.search_doc @@ websearch_to_tsquery('english', ${tsQuery || ' '})
              )`,
            ),
          )
          .limit(120),

        tx
          .select({
            slug: articles.slug,
            title: articles.title,
            summary: articles.summary,
          })
          .from(articles)
          .where(
            and(
              eq(articles.status, 'published'),
              sql`(
                articles.title ILIKE ${pattern}
                OR articles.summary ILIKE ${pattern}
                OR articles.search_doc @@ websearch_to_tsquery('english', ${tsQuery || ' '})
              )`,
            ),
          )
          .orderBy(desc(articles.publishedAt))
          .limit(limit),

        tx
          .select({
            slug: collections.slug,
            title: collections.title,
            description: collections.description,
          })
          .from(collections)
          .where(
            and(
              eq(collections.status, 'published'),
              sql`(
                collections.title ILIKE ${pattern}
                OR collections.description ILIKE ${pattern}
              )`,
            ),
          )
          .limit(limit),
      ]);

      const ranked = rankByName(
        trimmed,
        personRows.map((row) => ({
          name: row.fullName,
          aliases: row.alternateNames,
          row,
        })),
      ).slice(0, limit);

      const personHits: SearchHit[] = ranked.map(({ item }) => ({
        type: 'person',
        slug: item.row.slug,
        title: item.row.fullName,
        subtitle: item.row.summary.slice(0, 110),
      }));

      const articleHits: SearchHit[] = articleRows.map((row) => ({
        type: 'article',
        slug: row.slug,
        title: row.title,
        subtitle: row.summary.slice(0, 110),
      }));

      const collectionHits: SearchHit[] = collectionRows.map((row) => ({
        type: 'collection',
        slug: row.slug,
        title: row.title,
        subtitle: row.description.slice(0, 110),
      }));

      return {
        query: trimmed,
        people: personHits,
        articles: articleHits,
        collections: collectionHits,
        total: personHits.length + articleHits.length + collectionHits.length,
      };
    }, identity);
  },
);

export const listTags = cache(async (identity?: EditorIdentity) => {
  return withDb(async (tx) => {
    const rows = await tx
      .select({
        id: tags.id,
        slug: tags.slug,
        name: tags.name,
        description: tags.description,
        count: sql<number>`count(${people.id})::int`,
      })
      .from(tags)
      .leftJoin(
        sql`person_tags JOIN people ON people.id = person_tags.person_id AND people.status = 'published'`,
        sql`true`,
      )
      .groupBy(tags.id)
      .orderBy(asc(tags.name));

    return rows.filter((row) => row.count > 0);
  }, identity);
});

export const listPeriods = cache(async (identity?: EditorIdentity) => {
  return withDb(async (tx) => {
    return tx
      .select({
        slug: periods.slug,
        name: periods.name,
        startYear: periods.startYear,
        endYear: periods.endYear,
        description: periods.description,
        count: sql<number>`(
          SELECT count(*)::int FROM people p
          WHERE p.status = 'published'
            AND (
              (p.birth_date IS NOT NULL AND substring(p.birth_date from 1 for 4)::int BETWEEN periods.start_year AND periods.end_year)
              OR (p.death_date IS NOT NULL AND substring(p.death_date from 1 for 4)::int BETWEEN periods.start_year AND periods.end_year)
            )
        )`,
      })
      .from(periods)
      .orderBy(asc(periods.startYear));
  }, identity);
});

export const listPlaces = cache(async (identity?: EditorIdentity) => {
  return withDb(async (tx) => {
    return tx
      .select({
        slug: places.slug,
        name: places.name,
        country: places.country,
        region: places.region,
      })
      .from(places)
      .orderBy(asc(places.name));
  }, identity);
});

export const listAllSources = cache(async (identity?: EditorIdentity) => {
  return withDb(async (tx) => {
    return tx
      .select({
        id: sources.id,
        title: sources.title,
        author: sources.author,
        publisher: sources.publisher,
        url: sources.url,
        publishedDate: sources.publishedDate,
        type: sources.type,
        verificationStatus: sources.verificationStatus,
      })
      .from(sources)
      .orderBy(asc(sources.title));
  }, identity);
});

export type { SQL };

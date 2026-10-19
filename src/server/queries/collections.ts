import 'server-only';
import { asc, desc, eq, inArray, sql } from 'drizzle-orm';
import { cache } from 'react';
import {
  articles,
  categories,
  collectionItems,
  collections,
  mediaAssets,
  people,
  personCategories,
  personTags,
  tags,
} from '@/server/db/schema';
import { withDb, type EditorIdentity } from '@/server/db/tx';
import type { MediaRef, PersonSummary } from './people';
import { PERSON_COLUMNS, toSummary } from './people';

export type CollectionSummary = {
  id: string;
  slug: string;
  title: string;
  description: string;
  featured: boolean;
  itemCount: number;
  cover: MediaRef | null;
};

export type CollectionDetail = CollectionSummary & {
  introductionMd: string;
  seoTitle: string | null;
  seoDescription: string | null;
  items: {
    position: number;
    note: string | null;
    person: PersonSummary | null;
    article: { slug: string; title: string; summary: string | null } | null;
  }[];
};

function toCover(
  asset: {
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
  } | null,
): MediaRef | null {
  if (!asset) return null;
  return { ...asset, url: `/media/${asset.path}` };
}

export const listCollections = cache(
  async (identity?: EditorIdentity): Promise<CollectionSummary[]> => {
    return withDb(async (tx) => {
      const rows = await tx
        .select({
          id: collections.id,
          slug: collections.slug,
          title: collections.title,
          description: collections.description,
          featured: collections.featured,
          itemCount: sql<number>`count(${collectionItems.id})::int`,
          coverPath: mediaAssets.path,
          coverAlt: mediaAssets.altText,
          coverCaption: mediaAssets.caption,
          coverArtist: mediaAssets.artist,
          coverCredit: mediaAssets.credit,
          coverLicense: mediaAssets.licenseName,
          coverLicenseUrl: mediaAssets.licenseUrl,
          coverSourcePage: mediaAssets.sourcePageUrl,
          coverWidth: mediaAssets.width,
          coverHeight: mediaAssets.height,
        })
        .from(collections)
        .leftJoin(collectionItems, eq(collectionItems.collectionId, collections.id))
        .leftJoin(mediaAssets, eq(collections.coverMediaId, mediaAssets.id))
        .groupBy(collections.id, mediaAssets.id)
        .orderBy(desc(collections.featured), asc(collections.title));

      return rows.map((row) => ({
        id: row.id,
        slug: row.slug,
        title: row.title,
        description: row.description,
        featured: row.featured,
        itemCount: row.itemCount,
        cover: toCover(
          row.coverPath
            ? {
                path: row.coverPath,
                altText: row.coverAlt ?? row.title,
                caption: row.coverCaption,
                artist: row.coverArtist,
                credit: row.coverCredit,
                licenseName: row.coverLicense,
                licenseUrl: row.coverLicenseUrl,
                sourcePageUrl: row.coverSourcePage,
                width: row.coverWidth,
                height: row.coverHeight,
              }
            : null,
        ),
      }));
    }, identity);
  },
);

export const getCollectionBySlug = cache(
  async (slug: string, identity?: EditorIdentity): Promise<CollectionDetail | null> => {
    return withDb(async (tx) => {
      const rows = await tx
        .select({
          id: collections.id,
          slug: collections.slug,
          title: collections.title,
          description: collections.description,
          introductionMd: collections.introductionMd,
          featured: collections.featured,
          seoTitle: collections.seoTitle,
          seoDescription: collections.seoDescription,
          coverPath: mediaAssets.path,
          coverAlt: mediaAssets.altText,
          coverCaption: mediaAssets.caption,
          coverArtist: mediaAssets.artist,
          coverCredit: mediaAssets.credit,
          coverLicense: mediaAssets.licenseName,
          coverLicenseUrl: mediaAssets.licenseUrl,
          coverSourcePage: mediaAssets.sourcePageUrl,
          coverWidth: mediaAssets.width,
          coverHeight: mediaAssets.height,
        })
        .from(collections)
        .leftJoin(mediaAssets, eq(collections.coverMediaId, mediaAssets.id))
        .where(eq(collections.slug, slug))
        .limit(1);

      const row = rows[0];
      if (!row) return null;

      const itemRows = await tx
        .select({
          position: collectionItems.position,
          note: collectionItems.note,
          personId: collectionItems.personId,
          articleId: collectionItems.articleId,
        })
        .from(collectionItems)
        .where(eq(collectionItems.collectionId, row.id))
        .orderBy(asc(collectionItems.position));

      const personIds = itemRows
        .map((item) => item.personId)
        .filter((id): id is string => Boolean(id));

      const peopleById = new Map<string, PersonSummary>();
      if (personIds.length > 0) {
        const personRows = await tx
          .select(PERSON_COLUMNS)
          .from(people)
          .leftJoin(mediaAssets, eq(people.portraitMediaId, mediaAssets.id))
          .where(inArray(people.id, personIds));

        const taxonomy = new Map<
          string,
          { categories: { slug: string; name: string }[]; tags: { slug: string; name: string }[] }
        >();
        const [categoryRows, tagRows] = await Promise.all([
          tx
            .select({
              personId: personCategories.personId,
              slug: categories.slug,
              name: categories.name,
            })
            .from(personCategories)
            .innerJoin(categories, eq(personCategories.categoryId, categories.id))
            .where(inArray(personCategories.personId, personIds)),
          tx
            .select({ personId: personTags.personId, slug: tags.slug, name: tags.name })
            .from(personTags)
            .innerJoin(tags, eq(personTags.tagId, tags.id))
            .where(inArray(personTags.personId, personIds)),
        ]);
        for (const categoryRow of categoryRows) {
          const entry = taxonomy.get(categoryRow.personId) ?? { categories: [], tags: [] };
          entry.categories.push({ slug: categoryRow.slug, name: categoryRow.name });
          taxonomy.set(categoryRow.personId, entry);
        }
        for (const tagRow of tagRows) {
          const entry = taxonomy.get(tagRow.personId) ?? { categories: [], tags: [] };
          entry.tags.push({ slug: tagRow.slug, name: tagRow.name });
          taxonomy.set(tagRow.personId, entry);
        }

        for (const personRow of personRows) {
          peopleById.set(personRow.id, toSummary(personRow, taxonomy.get(personRow.id)));
        }
      }

      const articleIds = itemRows
        .map((item) => item.articleId)
        .filter((id): id is string => Boolean(id));

      const articlesById = new Map<string, { slug: string; title: string; summary: string | null }>();
      if (articleIds.length > 0) {
        const articleRows = await tx
          .select({ id: articles.id, slug: articles.slug, title: articles.title, summary: articles.summary })
          .from(articles)
          .where(inArray(articles.id, articleIds));
        for (const articleRow of articleRows) {
          articlesById.set(articleRow.id, {
            slug: articleRow.slug,
            title: articleRow.title,
            summary: articleRow.summary,
          });
        }
      }

      return {
        id: row.id,
        slug: row.slug,
        title: row.title,
        description: row.description,
        introductionMd: row.introductionMd,
        featured: row.featured,
        seoTitle: row.seoTitle,
        seoDescription: row.seoDescription,
        itemCount: itemRows.length,
        cover: toCover(
          row.coverPath
            ? {
                path: row.coverPath,
                altText: row.coverAlt ?? row.title,
                caption: row.coverCaption,
                artist: row.coverArtist,
                credit: row.coverCredit,
                licenseName: row.coverLicense,
                licenseUrl: row.coverLicenseUrl,
                sourcePageUrl: row.coverSourcePage,
                width: row.coverWidth,
                height: row.coverHeight,
              }
            : null,
        ),
        items: itemRows.map((item) => ({
          position: item.position,
          note: item.note,
          person: item.personId ? (peopleById.get(item.personId) ?? null) : null,
          article: item.articleId ? (articlesById.get(item.articleId) ?? null) : null,
        })),
      };
    }, identity);
  },
);

/** A collection with its members, for the admin editor. */
export const getCollectionForAdmin = cache(
  async (id: string, identity?: EditorIdentity) => {
    return withDb(async (tx) => {
      const rows = await tx
        .select({
          id: collections.id,
          slug: collections.slug,
          title: collections.title,
          description: collections.description,
          introductionMd: collections.introductionMd,
          featured: collections.featured,
          status: collections.status,
          seoTitle: collections.seoTitle,
          seoDescription: collections.seoDescription,
        })
        .from(collections)
        .where(eq(collections.id, id))
        .limit(1);

      const row = rows[0];
      if (!row) return null;

      const items = await tx
        .select({
          personId: collectionItems.personId,
          articleId: collectionItems.articleId,
        })
        .from(collectionItems)
        .where(eq(collectionItems.collectionId, id))
        .orderBy(asc(collectionItems.position));

      return {
        ...row,
        personIds: items.map((i) => i.personId).filter((v): v is string => Boolean(v)),
        articleIds: items.map((i) => i.articleId).filter((v): v is string => Boolean(v)),
      };
    }, identity);
  },
);

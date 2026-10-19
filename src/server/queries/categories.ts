import 'server-only';
import { and, asc, eq, sql, type SQL } from 'drizzle-orm';
import { cache } from 'react';
import { alias } from 'drizzle-orm/pg-core';
import { categories, mediaAssets, people, personCategories } from '@/server/db/schema';
import { withDb, type EditorIdentity } from '@/server/db/tx';
import type { MediaRef } from './people';

export type CategorySummary = {
  id: string;
  slug: string;
  name: string;
  description: string;
  parentId: string | null;
  parentName: string | null;
  featured: boolean;
  status: string;
  sortOrder: number;
  personCount: number;
  seoTitle: string | null;
  seoDescription: string | null;
  cover: MediaRef | null;
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

export const listCategories = cache(
  async (identity?: EditorIdentity): Promise<CategorySummary[]> => {
    return withDb(async (tx) => {
      const parent = alias(categories, 'parent_category');
      const rows = await tx
        .select({
          id: categories.id,
          slug: categories.slug,
          name: categories.name,
          description: categories.description,
          parentId: categories.parentId,
          parentName: parent.name,
          featured: categories.featured,
          status: categories.status,
          sortOrder: categories.sortOrder,
          seoTitle: categories.seoTitle,
          seoDescription: categories.seoDescription,
          personCount: sql<number>`count(${people.id})::int`,
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
        .from(categories)
        .leftJoin(parent, eq(categories.parentId, parent.id))
        .leftJoin(personCategories, eq(personCategories.categoryId, categories.id))
        .leftJoin(people, and(eq(people.id, personCategories.personId), eq(people.status, 'published')))
        .leftJoin(mediaAssets, eq(categories.coverMediaId, mediaAssets.id))
        .groupBy(categories.id, mediaAssets.id, parent.name)
        .orderBy(asc(categories.sortOrder), asc(categories.name));

      return rows.map((row) => ({
        id: row.id,
        slug: row.slug,
        name: row.name,
        description: row.description,
        parentId: row.parentId,
        parentName: row.parentName,
        featured: row.featured,
        status: row.status,
        sortOrder: row.sortOrder,
        personCount: row.personCount,
        seoTitle: row.seoTitle,
        seoDescription: row.seoDescription,
        cover: toCover(
          row.coverPath
            ? {
                path: row.coverPath,
                altText: row.coverAlt ?? row.name,
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

export const getCategoryBySlug = cache(
  async (slug: string, identity?: EditorIdentity) => {
    const all = await listCategories(identity);
    return all.find((category) => category.slug === slug) ?? null;
  },
);

/** Categories that have at least one published person, with their counts. */
export async function listCategoryCounts(identity?: EditorIdentity) {
  return withDb(async (tx) => {
    const rows = await tx
      .select({
        slug: categories.slug,
        name: categories.name,
        count: sql<number>`count(${people.id})::int`,
      })
      .from(categories)
      .leftJoin(personCategories, eq(personCategories.categoryId, categories.id))
      .leftJoin(people, and(eq(people.id, personCategories.personId), eq(people.status, 'published')))
      .groupBy(categories.id)
      .orderBy(asc(categories.sortOrder));

    return rows;
  }, identity);
}

export type { SQL };

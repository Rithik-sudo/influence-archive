import 'server-only';
import { and, desc, eq, ilike, or, sql, type SQL } from 'drizzle-orm';
import { cache } from 'react';
import {
  articleCategories,
  articlePeople,
  articleRelations,
  articleSources,
  articles,
  categories,
  mediaAssets,
  people,
  sources,
  tags,
  articleTags,
} from '@/server/db/schema';
import { withDb, type EditorIdentity } from '@/server/db/tx';
import type { MediaRef, PersonSummary } from './people';

export type ArticleSummary = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  publishedAt: Date | null;
  updatedAt: Date | null;
  hero: MediaRef | null;
  relatedPeople: { slug: string; fullName: string; portrait: MediaRef | null }[];
};

export type ArticleDetail = ArticleSummary & {
  contentMd: string;
  seoTitle: string | null;
  seoDescription: string | null;
  authorName: string | null;
  categories: { slug: string; name: string }[];
  tags: { slug: string; name: string }[];
  relatedArticles: { slug: string; title: string }[];
  sources: {
    id: string;
    title: string;
    author: string | null;
    publisher: string | null;
    url: string | null;
    publishedDate: string | null;
    type: string;
    locator: string | null;
    verificationStatus: string;
  }[];
};

function toHero(
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

export const listArticles = cache(
  async (limit = 20, identity?: EditorIdentity): Promise<ArticleSummary[]> => {
    return withDb(async (tx) => {
      const rows = await tx
        .select({
          id: articles.id,
          slug: articles.slug,
          title: articles.title,
          summary: articles.summary,
          publishedAt: articles.publishedAt,
          updatedAt: articles.updatedAt,
          heroPath: mediaAssets.path,
          heroAlt: mediaAssets.altText,
          heroCaption: mediaAssets.caption,
          heroArtist: mediaAssets.artist,
          heroCredit: mediaAssets.credit,
          heroLicense: mediaAssets.licenseName,
          heroLicenseUrl: mediaAssets.licenseUrl,
          heroSourcePage: mediaAssets.sourcePageUrl,
          heroWidth: mediaAssets.width,
          heroHeight: mediaAssets.height,
        })
        .from(articles)
        .leftJoin(mediaAssets, eq(articles.heroMediaId, mediaAssets.id))
        .where(eq(articles.status, 'published'))
        .orderBy(desc(articles.publishedAt))
        .limit(limit);

      return Promise.all(
        rows.map(async (row) => {
          const relatedRows = await tx
            .select({
              slug: people.slug,
              fullName: people.fullName,
              path: mediaAssets.path,
              alt: mediaAssets.altText,
              caption: mediaAssets.caption,
              artist: mediaAssets.artist,
              credit: mediaAssets.credit,
              license: mediaAssets.licenseName,
              licenseUrl: mediaAssets.licenseUrl,
              sourcePage: mediaAssets.sourcePageUrl,
              width: mediaAssets.width,
              height: mediaAssets.height,
            })
            .from(articlePeople)
            .innerJoin(people, eq(articlePeople.personId, people.id))
            .leftJoin(mediaAssets, eq(people.portraitMediaId, mediaAssets.id))
            .where(eq(articlePeople.articleId, row.id));

          return {
            id: row.id,
            slug: row.slug,
            title: row.title,
            summary: row.summary,
            publishedAt: row.publishedAt,
            updatedAt: row.updatedAt,
            hero: toHero(
              row.heroPath
                ? {
                    path: row.heroPath,
                    altText: row.heroAlt ?? row.title,
                    caption: row.heroCaption,
                    artist: row.heroArtist,
                    credit: row.heroCredit,
                    licenseName: row.heroLicense,
                    licenseUrl: row.heroLicenseUrl,
                    sourcePageUrl: row.heroSourcePage,
                    width: row.heroWidth,
                    height: row.heroHeight,
                  }
                : null,
            ),
            relatedPeople: relatedRows.map((rel) => ({
              slug: rel.slug,
              fullName: rel.fullName,
              portrait: toHero(
                rel.path
                  ? {
                      path: rel.path,
                      altText: rel.alt ?? rel.fullName,
                      caption: rel.caption,
                      artist: rel.artist,
                      credit: rel.credit,
                      licenseName: rel.license,
                      licenseUrl: rel.licenseUrl,
                      sourcePageUrl: rel.sourcePage,
                      width: rel.width,
                      height: rel.height,
                    }
                  : null,
              ),
            })),
          };
        }),
      );
    }, identity);
  },
);

export const getArticleBySlug = cache(
  async (slug: string, identity?: EditorIdentity): Promise<ArticleDetail | null> => {
    return withDb(async (tx) => {
      const rows = await tx
        .select({
          id: articles.id,
          slug: articles.slug,
          title: articles.title,
          summary: articles.summary,
          contentMd: articles.contentMd,
          publishedAt: articles.publishedAt,
          updatedAt: articles.updatedAt,
          seoTitle: articles.seoTitle,
          seoDescription: articles.seoDescription,
          heroPath: mediaAssets.path,
          heroAlt: mediaAssets.altText,
          heroCaption: mediaAssets.caption,
          heroArtist: mediaAssets.artist,
          heroCredit: mediaAssets.credit,
          heroLicense: mediaAssets.licenseName,
          heroLicenseUrl: mediaAssets.licenseUrl,
          heroSourcePage: mediaAssets.sourcePageUrl,
          heroWidth: mediaAssets.width,
          heroHeight: mediaAssets.height,
        })
        .from(articles)
        .leftJoin(mediaAssets, eq(articles.heroMediaId, mediaAssets.id))
        .where(eq(articles.slug, slug))
        .limit(1);

      const row = rows[0];
      if (!row) return null;

      const [categoryRows, tagRows, relatedPeopleRows, relatedArticleRows, sourceRows] =
        await Promise.all([
          tx
            .select({ slug: categories.slug, name: categories.name })
            .from(articleCategories)
            .innerJoin(categories, eq(articleCategories.categoryId, categories.id))
            .where(eq(articleCategories.articleId, row.id)),
          tx
            .select({ slug: tags.slug, name: tags.name })
            .from(articleTags)
            .innerJoin(tags, eq(articleTags.tagId, tags.id))
            .where(eq(articleTags.articleId, row.id)),
          tx
            .select({
              slug: people.slug,
              fullName: people.fullName,
              path: mediaAssets.path,
              alt: mediaAssets.altText,
              caption: mediaAssets.caption,
              artist: mediaAssets.artist,
              credit: mediaAssets.credit,
              license: mediaAssets.licenseName,
              licenseUrl: mediaAssets.licenseUrl,
              sourcePage: mediaAssets.sourcePageUrl,
              width: mediaAssets.width,
              height: mediaAssets.height,
            })
            .from(articlePeople)
            .innerJoin(people, eq(articlePeople.personId, people.id))
            .leftJoin(mediaAssets, eq(people.portraitMediaId, mediaAssets.id))
            .where(eq(articlePeople.articleId, row.id)),
          tx
            .select({ slug: articles.slug, title: articles.title })
            .from(articleRelations)
            .innerJoin(
              articles,
              eq(articleRelations.relatedArticleId, articles.id),
            )
            .where(eq(articleRelations.articleId, row.id)),
          tx
            .select({
              id: sources.id,
              title: sources.title,
              author: sources.author,
              publisher: sources.publisher,
              url: sources.url,
              publishedDate: sources.publishedDate,
              type: sources.type,
              locator: articleSources.locator,
              verificationStatus: sources.verificationStatus,
            })
            .from(articleSources)
            .innerJoin(sources, eq(articleSources.sourceId, sources.id))
            .where(eq(articleSources.articleId, row.id)),
        ]);

      return {
        id: row.id,
        slug: row.slug,
        title: row.title,
        summary: row.summary,
        contentMd: row.contentMd,
        publishedAt: row.publishedAt,
        updatedAt: row.updatedAt,
        seoTitle: row.seoTitle,
        seoDescription: row.seoDescription,
        authorName: null,
        hero: toHero(
          row.heroPath
            ? {
                path: row.heroPath,
                altText: row.heroAlt ?? row.title,
                caption: row.heroCaption,
                artist: row.heroArtist,
                credit: row.heroCredit,
                licenseName: row.heroLicense,
                licenseUrl: row.heroLicenseUrl,
                sourcePageUrl: row.heroSourcePage,
                width: row.heroWidth,
                height: row.heroHeight,
              }
            : null,
        ),
        categories: categoryRows,
        tags: tagRows,
        relatedPeople: relatedPeopleRows.map((rel) => ({
          slug: rel.slug,
          fullName: rel.fullName,
          portrait: toHero(
            rel.path
              ? {
                  path: rel.path,
                  altText: rel.alt ?? rel.fullName,
                  caption: rel.caption,
                  artist: rel.artist,
                  credit: rel.credit,
                  licenseName: rel.license,
                  licenseUrl: rel.licenseUrl,
                  sourcePageUrl: rel.sourcePage,
                  width: rel.width,
                  height: rel.height,
                }
              : null,
          ),
        })),
        relatedArticles: relatedArticleRows,
        sources: sourceRows,
      };
    }, identity);
  },
);

export async function searchArticles(query: string, limit = 6, identity?: EditorIdentity) {
  const trimmed = query.trim();
  if (!trimmed) return [];

  const tsQuery = trimmed
    .split(/\s+/)
    .map((word) => word.replace(/[^\p{L}\p{N}]/gu, ''))
    .filter(Boolean)
    .join(' & ');

  return withDb(async (tx) => {
    const rows = await tx
      .select({
        id: articles.id,
        slug: articles.slug,
        title: articles.title,
        summary: articles.summary,
        publishedAt: articles.publishedAt,
      })
      .from(articles)
      .where(
        and(
          eq(articles.status, 'published'),
          or(
            ilike(articles.title, `%${trimmed}%`),
            ilike(articles.summary, `%${trimmed}%`),
            sql`articles.search_doc @@ websearch_to_tsquery('english', ${tsQuery || ' '})`,
          ),
        ),
      )
      .orderBy(desc(articles.publishedAt))
      .limit(limit);

    return rows;
  }, identity);
}

export type { SQL, PersonSummary };

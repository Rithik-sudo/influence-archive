import 'server-only';
import { asc, desc, eq, sql } from 'drizzle-orm';
import { cache } from 'react';
import { articles, mediaAssets, sources } from '@/server/db/schema';
import { withDb, type EditorIdentity } from '@/server/db/tx';

export const listAdminArticles = cache(
  async (identity?: EditorIdentity) => {
    return withDb(async (tx) => {
      return tx
        .select({
          id: articles.id,
          slug: articles.slug,
          title: articles.title,
          summary: articles.summary,
          status: articles.status,
          publishedAt: articles.publishedAt,
          updatedAt: articles.updatedAt,
        })
        .from(articles)
        .orderBy(desc(articles.updatedAt));
    }, identity);
  },
);

export const listAdminMedia = cache(
  async (identity?: EditorIdentity) => {
    return withDb(async (tx) => {
      return tx
        .select({
          id: mediaAssets.id,
          path: mediaAssets.path,
          mimeType: mediaAssets.mimeType,
          bytes: mediaAssets.bytes,
          width: mediaAssets.width,
          height: mediaAssets.height,
          altText: mediaAssets.altText,
          caption: mediaAssets.caption,
          artist: mediaAssets.artist,
          credit: mediaAssets.credit,
          licenseName: mediaAssets.licenseName,
          licenseUrl: mediaAssets.licenseUrl,
          sourcePageUrl: mediaAssets.sourcePageUrl,
        })
        .from(mediaAssets)
        .orderBy(asc(mediaAssets.path));
    }, identity);
  },
);

export const listAdminSources = cache(
  async (identity?: EditorIdentity) => {
    return withDb(async (tx) => {
      return tx
        .select({
          id: sources.id,
          key: sources.key,
          title: sources.title,
          author: sources.author,
          publisher: sources.publisher,
          url: sources.url,
          publishedDate: sources.publishedDate,
          type: sources.type,
          notes: sources.notes,
          verificationStatus: sources.verificationStatus,
          verifiedAt: sources.verifiedAt,
          usedBy: sql<number>`(
            SELECT count(*)::int FROM person_sources ps
            WHERE ps.source_id = ${sources.id}
          ) + (
            SELECT count(*)::int FROM article_sources asrc
            WHERE asrc.source_id = ${sources.id}
          )`,
        })
        .from(sources)
        .orderBy(asc(sources.title));
    }, identity);
  },
);

export const getArticleForAdmin = cache(
  async (id: string, identity?: EditorIdentity) => {
    return withDb(async (tx) => {
      const rows = await tx
        .select()
        .from(articles)
        .where(eq(articles.id, id))
        .limit(1);
      return rows[0] ?? null;
    }, identity);
  },
);

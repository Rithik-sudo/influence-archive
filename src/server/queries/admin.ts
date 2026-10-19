import 'server-only';
import { desc, eq, sql } from 'drizzle-orm';
import { cache } from 'react';
import {
  articles,
  auditLog,
  categories,
  collections,
  mediaAssets,
  people,
  sources,
  tags,
} from '@/server/db/schema';
import { withDb, type EditorIdentity } from '@/server/db/tx';

export type DashboardStats = {
  publishedPeople: number;
  draftPeople: number;
  reviewPeople: number;
  archivedPeople: number;
  publishedArticles: number;
  draftArticles: number;
  categoryCount: number;
  tagCount: number;
  collectionCount: number;
  sourceCount: number;
  unverifiedSources: number;
  mediaCount: number;
};

export const getDashboardStats = cache(async (identity?: EditorIdentity): Promise<DashboardStats> => {
  return withDb(async (tx) => {
    const [peopleByStatus, articlesByStatus, categoryCount, tagCount, collectionCount, sourceCount, unverified, media] =
      await Promise.all([
        tx
          .select({ status: people.status, count: sql<number>`count(*)::int` })
          .from(people)
          .groupBy(people.status),
        tx
          .select({ status: articles.status, count: sql<number>`count(*)::int` })
          .from(articles)
          .groupBy(articles.status),
        tx.select({ count: sql<number>`count(*)::int` }).from(categories),
        tx.select({ count: sql<number>`count(*)::int` }).from(tags),
        tx.select({ count: sql<number>`count(*)::int` }).from(collections),
        tx.select({ count: sql<number>`count(*)::int` }).from(sources),
        tx
          .select({ count: sql<number>`count(*)::int` })
          .from(sources)
          .where(eq(sources.verificationStatus, 'unverified')),
        tx.select({ count: sql<number>`count(*)::int` }).from(mediaAssets),
      ]);

    const byStatus = (rows: { status: string; count: number }[]) => {
      const map = new Map(rows.map((r) => [r.status, r.count]));
      return {
        published: map.get('published') ?? 0,
        draft: map.get('draft') ?? 0,
        review: map.get('in_review') ?? 0,
        archived: map.get('archived') ?? 0,
      };
    };

    const p = byStatus(peopleByStatus);
    const a = byStatus(articlesByStatus);

    return {
      publishedPeople: p.published,
      draftPeople: p.draft,
      reviewPeople: p.review,
      archivedPeople: p.archived,
      publishedArticles: a.published,
      draftArticles: a.draft,
      categoryCount: categoryCount[0]?.count ?? 0,
      tagCount: tagCount[0]?.count ?? 0,
      collectionCount: collectionCount[0]?.count ?? 0,
      sourceCount: sourceCount[0]?.count ?? 0,
      unverifiedSources: unverified[0]?.count ?? 0,
      mediaCount: media[0]?.count ?? 0,
    };
  }, identity);
});

export type RecentChange = {
  id: string;
  action: string;
  entityType: string;
  entityId: string | null;
  detail: string | null;
  at: Date;
  userName: string | null;
};

export const getRecentChanges = cache(
  async (limit = 12, identity?: EditorIdentity): Promise<RecentChange[]> => {
    return withDb(async (tx) => {
      return tx
        .select({
          id: auditLog.id,
          action: auditLog.action,
          entityType: auditLog.entityType,
          entityId: auditLog.entityId,
          detail: auditLog.detail,
          at: auditLog.at,
          userName: sql<string | null>`(SELECT display_name FROM users WHERE users.id = audit_log.user_id)`,
        })
        .from(auditLog)
        .orderBy(desc(auditLog.at))
        .limit(limit);
    }, identity);
  },
);

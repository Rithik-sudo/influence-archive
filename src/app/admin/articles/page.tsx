import type { Metadata } from 'next';
import Link from 'next/link';
import { getEditorIdentity } from '@/server/auth/session';
import { listAdminArticles } from '@/server/queries/adminLists';
import { deleteArticleAction } from '@/server/actions/content';
import { ActionForm } from '@/components/admin/ActionForm';
import { StatusPill } from '@/components/admin/StatusPill';
import { EmptyState } from '@/components/ui/States';
import { formatPublishedDate } from '@/lib/format';

export const metadata: Metadata = { title: 'Essays' };
export const dynamic = 'force-dynamic';

export default async function AdminArticlesPage() {
  const identity = await getEditorIdentity();
  const articles = await listAdminArticles(identity);

  return (
    <div>
      <header className="flex flex-wrap items-end justify-between gap-4 border-b border-rule pb-6">
        <div>
          <p className="eyebrow">Editorial</p>
          <h1 className="mt-2 font-display text-[1.75rem] font-semibold text-ink">Essays</h1>
          <p className="mt-1.5 text-small text-ink-muted">
            {articles.length} {articles.length === 1 ? 'essay' : 'essays'}
          </p>
        </div>
        <Link
          href="/admin/articles/new"
          className="inline-flex h-9 items-center rounded-[var(--radius-md)] bg-accent px-3.5 text-[13px] font-medium text-accent-ink transition-colors hover:bg-accent-hover"
        >
          New essay
        </Link>
      </header>

      {articles.length === 0 ? (
        <EmptyState className="mt-8" title="No essays yet" description="Start one above." />
      ) : (
        <ul className="mt-8 divide-y divide-[var(--rule)] border-t border-rule">
          {articles.map((article) => (
            <li key={article.id} className="flex flex-wrap items-center gap-x-4 gap-y-2 py-3">
              <div className="min-w-0 flex-1">
                <Link
                  href={`/admin/articles/${article.id}`}
                  className="font-display text-[1rem] font-semibold text-ink hover:text-accent"
                >
                  {article.title}
                </Link>
                <p className="mt-0.5 font-mono text-[11px] text-ink-faint">
                  {article.slug} · updated {formatPublishedDate(article.updatedAt)}
                </p>
              </div>
              <StatusPill status={article.status} />
              <Link
                href={`/articles/${article.slug}`}
                className="text-[13px] text-ink-muted transition-colors hover:text-accent"
              >
                View
              </Link>
              <ActionForm
                action={deleteArticleAction}
                className="flex items-center"
                hiddenFields={{ id: article.id }}
                requireConfirmation
                confirmLabel="Delete essay"
                submitLabel="Delete"
              >
                <button
                  type="submit"
                  className="text-[13px] text-ink-faint transition-colors hover:text-accent"
                >
                  Delete
                </button>
              </ActionForm>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

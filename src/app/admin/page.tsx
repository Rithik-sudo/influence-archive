import type { Metadata } from 'next';
import Link from 'next/link';
import { getDashboardStats, getRecentChanges } from '@/server/queries/admin';
import { getEditorIdentity } from '@/server/auth/session';
import { StatusPill } from '@/components/admin/StatusPill';
import { EmptyState } from '@/components/ui/States';
import { formatPublishedDate } from '@/lib/format';

export const metadata: Metadata = { title: 'Dashboard' };
export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const identity = await getEditorIdentity();
  const [stats, changes] = await Promise.all([
    getDashboardStats(identity),
    getRecentChanges(12, identity),
  ]);

  const tiles = [
    { label: 'Published profiles', value: stats.publishedPeople, href: '/admin/people' },
    { label: 'Draft profiles', value: stats.draftPeople, href: '/admin/people' },
    { label: 'In review', value: stats.reviewPeople, href: '/admin/people' },
    { label: 'Archived', value: stats.archivedPeople, href: '/admin/people' },
    { label: 'Published essays', value: stats.publishedArticles, href: '/admin/articles' },
    { label: 'Draft essays', value: stats.draftArticles, href: '/admin/articles' },
    { label: 'Fields', value: stats.categoryCount, href: '/admin/categories' },
    { label: 'Collections', value: stats.collectionCount, href: '/admin/collections' },
    { label: 'Tags', value: stats.tagCount, href: '/admin/tags' },
    { label: 'Sources', value: stats.sourceCount, href: '/admin/sources' },
    { label: 'Unverified sources', value: stats.unverifiedSources, href: '/admin/sources' },
    { label: 'Media assets', value: stats.mediaCount, href: '/admin/media' },
  ];

  return (
    <div>
      <header className="flex flex-wrap items-end justify-between gap-4 border-b border-rule pb-6">
        <div>
          <p className="eyebrow">Overview</p>
          <h1 className="mt-2 font-display text-[1.75rem] font-semibold text-ink">Dashboard</h1>
        </div>
        <div className="flex gap-3">
          <Link
            href="/admin/people/new"
            className="inline-flex h-9 items-center rounded-[var(--radius-md)] bg-accent px-3.5 text-[13px] font-medium text-accent-ink transition-colors hover:bg-accent-hover"
          >
            New profile
          </Link>
          <Link
            href="/admin/articles/new"
            className="inline-flex h-9 items-center rounded-[var(--radius-md)] border border-rule px-3.5 text-[13px] text-ink transition-colors hover:border-accent hover:text-accent"
          >
            New essay
          </Link>
        </div>
      </header>

      <dl className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-[var(--radius-md)] border border-rule bg-rule sm:grid-cols-3 lg:grid-cols-4">
        {tiles.map((tile) => (
          <Link key={tile.label} href={tile.href} className="bg-surface p-4 transition-colors hover:bg-surface-sunken">
            <dt className="eyebrow">{tile.label}</dt>
            <dd className="mt-2 font-display text-[1.75rem] font-semibold leading-none text-ink">
              {tile.value}
            </dd>
          </Link>
        ))}
      </dl>

      <section className="mt-10">
        <h2 className="eyebrow border-t border-rule pt-4">Recent changes</h2>
        {changes.length > 0 ? (
          <ul className="mt-4 divide-y divide-[var(--rule)]">
            {changes.map((change) => (
              <li key={change.id} className="flex flex-wrap items-baseline gap-x-3 gap-y-1 py-2.5">
                <span className="font-mono text-[11px] text-ink-faint">
                  {formatPublishedDate(change.at)}
                </span>
                <span className="text-[13px] text-ink">{change.action.replace(/\./g, ' ')}</span>
                {change.detail ? (
                  <span className="truncate text-[13px] text-ink-muted">{change.detail}</span>
                ) : null}
                <span className="ml-auto text-[12px] text-ink-faint">
                  {change.userName ?? 'system'}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState
            className="mt-4"
            title="Nothing recorded yet"
            description="Edits made in the desk are logged here."
          />
        )}
      </section>

      <section className="mt-10">
        <h2 className="eyebrow border-t border-rule pt-4">Needs attention</h2>
        <ul className="mt-4 space-y-2 text-small text-ink-muted">
          <li>
            <StatusPill status="unverified" />{' '}
            {stats.unverifiedSources} source link
            {stats.unverifiedSources === 1 ? '' : 's'} have not been confirmed. Run{' '}
            <code className="font-mono text-[12px] text-ink">npm run db:verify</code>.
          </li>
          <li>
            <StatusPill status="draft" /> {stats.draftPeople} profile
            {stats.draftPeople === 1 ? '' : 's'} and {stats.draftArticles} essay
            {stats.draftArticles === 1 ? '' : 's'} are still drafts.
          </li>
        </ul>
      </section>
    </div>
  );
}

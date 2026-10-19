import type { Metadata } from 'next';
import Link from 'next/link';
import { getEditorIdentity } from '@/server/auth/session';
import { listPeople } from '@/server/queries/people';
import { listCategoryCounts } from '@/server/queries/categories';
import { setPersonStatusAction } from '@/server/actions/people';
import { StatusPill } from '@/components/admin/StatusPill';
import { StatusSelect } from '@/components/admin/StatusSelect';
import { EmptyState } from '@/components/ui/States';
import { formatLifespanCompact } from '@/lib/format';

export const metadata: Metadata = { title: 'People' };
export const dynamic = 'force-dynamic';

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function AdminPeoplePage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const query = typeof params.q === 'string' ? params.q : undefined;
  const status =
    typeof params.status === 'string'
      ? (params.status as 'draft' | 'in_review' | 'published' | 'archived')
      : undefined;
  const category = typeof params.category === 'string' ? params.category : undefined;

  const identity = await getEditorIdentity();
  const [result, categories] = await Promise.all([
    listPeople({ query, status, category, perPage: 60, sort: 'alpha' }, identity),
    listCategoryCounts(),
  ]);

  return (
    <div>
      <header className="flex flex-wrap items-end justify-between gap-4 border-b border-rule pb-6">
        <div>
          <p className="eyebrow">Content</p>
          <h1 className="mt-2 font-display text-[1.75rem] font-semibold text-ink">People</h1>
          <p className="mt-1.5 text-small text-ink-muted">
            {result.total} {result.total === 1 ? 'profile' : 'profiles'}
          </p>
        </div>
        <Link
          href="/admin/people/new"
          className="inline-flex h-9 items-center rounded-[var(--radius-md)] bg-accent px-3.5 text-[13px] font-medium text-accent-ink transition-colors hover:bg-accent-hover"
        >
          New profile
        </Link>
      </header>

      <form method="get" className="mt-6 flex flex-wrap items-end gap-3">
        <div>
          <label htmlFor="q" className="eyebrow block">
            Search
          </label>
          <input
            id="q"
            name="q"
            type="search"
            defaultValue={query ?? ''}
            placeholder="Name or alias"
            className="mt-1.5 h-9 w-56 rounded-[var(--radius-md)] border border-rule bg-surface px-2.5 text-[13px] outline-none focus:border-accent"
          />
        </div>
        <div>
          <label htmlFor="status" className="eyebrow block">
            Status
          </label>
          <select
            id="status"
            name="status"
            defaultValue={status ?? ''}
            className="mt-1.5 h-9 rounded-[var(--radius-md)] border border-rule bg-surface px-2 text-[13px] outline-none focus:border-accent"
          >
            <option value="">Any status</option>
            <option value="draft">Draft</option>
            <option value="in_review">In review</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
        </div>
        <div>
          <label htmlFor="category" className="eyebrow block">
            Field
          </label>
          <select
            id="category"
            name="category"
            defaultValue={category ?? ''}
            className="mt-1.5 h-9 rounded-[var(--radius-md)] border border-rule bg-surface px-2 text-[13px] outline-none focus:border-accent"
          >
            <option value="">Any field</option>
            {categories.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="h-9 rounded-[var(--radius-md)] border border-rule px-3.5 text-[13px] text-ink transition-colors hover:border-accent hover:text-accent"
        >
          Filter
        </button>
        {query || status || category ? (
          <Link href="/admin/people" className="h-9 text-[13px] leading-9 text-ink-muted hover:text-accent">
            Clear
          </Link>
        ) : null}
      </form>

      {result.items.length === 0 ? (
        <EmptyState
          className="mt-8"
          title="No profiles match"
          description="Try a different search, or start a new profile."
        />
      ) : (
        <ul className="mt-8 divide-y divide-[var(--rule)] border-t border-rule">
          {result.items.map((person) => (
            <li key={person.id} className="flex flex-wrap items-center gap-x-4 gap-y-2 py-3">
              <div className="min-w-0 flex-1">
                <Link
                  href={`/admin/people/${person.id}`}
                  className="font-display text-[1rem] font-semibold text-ink hover:text-accent"
                >
                  {person.fullName}
                </Link>
                <p className="mt-0.5 font-mono text-[11px] text-ink-faint">
                  {formatLifespanCompact(
                    { date: person.birthDate, precision: person.birthPrecision },
                    { date: person.deathDate, precision: person.deathPrecision },
                    person.isLiving,
                  )}{' '}
                  · {person.occupations.slice(0, 2).join(', ') || 'No occupation set'}
                </p>
              </div>
              <StatusPill status={person.status} />
              <StatusSelect
                action={setPersonStatusAction}
                id={person.id}
                status={person.status}
                label={`Status for ${person.fullName}`}
              />
              <Link
                href={`/people/${person.slug}`}
                className="text-[13px] text-ink-muted transition-colors hover:text-accent"
              >
                View
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

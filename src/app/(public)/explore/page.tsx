import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import { listPeople, getFacets } from '@/server/queries/people';
import { listCategoryCounts } from '@/server/queries/categories';
import { listTags, listPeriods } from '@/server/queries/search';
import { PersonCard } from '@/components/content/PersonCard';
import { Pagination } from '@/components/content/Navigation';
import { FilterRail } from '@/components/content/FilterRail';
import { EmptyState } from '@/components/ui/States';

export const metadata: Metadata = {
  title: 'Explore the archive',
  description:
    'Search and filter every figure in the archive by field, tag, era, country and profession.',
  alternates: { canonical: '/explore' },
};

export const dynamic = 'force-dynamic';

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function first(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value ?? undefined;
}

export default async function ExplorePage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;

  const filters = {
    category: first(params.category),
    tag: first(params.tag),
    period: first(params.period),
    country: first(params.country),
    occupation: first(params.occupation),
    living: first(params.living) as 'living' | 'deceased' | undefined,
    query: first(params.q),
    sort: first(params.sort) as
      | 'featured'
      | 'alpha'
      | 'recent'
      | 'birth'
      | undefined,
    page: Number(first(params.page) ?? '1') || 1,
    perPage: 24,
  };

  const [result, categoryCounts, tagCounts, periodList, facets] = await Promise.all([
    listPeople(filters),
    listCategoryCounts(),
    listTags(),
    listPeriods(),
    getFacets(),
  ]);

  const hasFilters = Boolean(
    filters.category ||
      filters.tag ||
      filters.period ||
      filters.country ||
      filters.occupation ||
      filters.living ||
      filters.query,
  );

  return (
    <div className="mx-auto max-w-[1440px] px-5 py-10 sm:px-8 sm:py-14">
      <header className="border-b border-rule pb-8">
        <p className="eyebrow">The directory</p>
        <h1 className="mt-3 text-title font-semibold text-ink">Explore the archive</h1>
        <p className="mt-3 max-w-[58ch] text-lede leading-relaxed text-ink-muted">
          {result.total} {result.total === 1 ? 'profile' : 'profiles'}
          {filters.query ? ` matching “${filters.query}”` : ''}. Filter by field, era, country or
          profession, or browse the full list.
        </p>
      </header>

      <div className="grid gap-12 pt-10 lg:grid-cols-[minmax(0,15rem)_minmax(0,1fr)] lg:gap-16">
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <Suspense fallback={<div className="h-96" />}>
            <FilterRail
              categories={categoryCounts.map((c) => ({ value: c.slug, label: c.name, count: c.count }))}
              tags={tagCounts.map((t) => ({ value: t.slug, label: t.name, count: t.count }))}
              periods={periodList.map((p) => ({
                value: p.slug,
                label: `${p.name} (${p.startYear}–${p.endYear})`,
                count: p.count,
              }))}
              countries={facets.countries
                .filter((c): c is string => Boolean(c))
                .map((c) => ({ value: c, label: c }))}
              occupations={facets.occupations
                .filter((o): o is string => Boolean(o))
                .map((o) => ({ value: o, label: o }))}
              total={result.total}
            />
          </Suspense>
        </aside>

        <section aria-label="Profiles">
          {result.items.length > 0 ? (
            <>
              <ul className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
                {result.items.map((person) => (
                  <li key={person.id}>
                    <PersonCard person={person} />
                  </li>
                ))}
              </ul>

              <Pagination
                className="mt-14 border-t border-rule pt-6"
                page={result.page}
                pageCount={result.pageCount}
                basePath="/explore"
                params={{
                  category: filters.category,
                  tag: filters.tag,
                  period: filters.period,
                  country: filters.country,
                  occupation: filters.occupation,
                  living: filters.living,
                  sort: filters.sort,
                  q: filters.query,
                }}
              />
            </>
          ) : (
            <EmptyState
              title={hasFilters ? 'No profiles match these filters' : 'The archive is empty'}
              description={
                hasFilters
                  ? 'Try removing a filter, or search for a name and alias instead.'
                  : 'Profiles appear here once they are published by the editorial desk.'
              }
              action={
                hasFilters ? (
                  <Link
                    href="/explore"
                    className="inline-block rounded-[var(--radius-md)] bg-accent px-4 py-2 text-small font-medium text-accent-ink transition-colors hover:bg-accent-hover"
                  >
                    Clear all filters
                  </Link>
                ) : undefined
              }
            />
          )}
        </section>
      </div>
    </div>
  );
}

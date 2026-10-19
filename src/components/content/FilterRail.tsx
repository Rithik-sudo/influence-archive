'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

export type FilterOption = { value: string; label: string; count?: number };

export type FilterState = {
  category?: string;
  tag?: string;
  period?: string;
  country?: string;
  occupation?: string;
  living?: string;
  sort?: string;
  q?: string;
};

/**
 * The filter rail. A plain GET form, so it works without JavaScript; with
 * JavaScript it submits on change. Every filter is reflected in the URL, so
 * a filtered view can be shared or bookmarked.
 */
export function FilterRail({
  categories,
  tags,
  periods,
  countries,
  occupations,
  total,
}: {
  categories: FilterOption[];
  tags: FilterOption[];
  periods: FilterOption[];
  countries: FilterOption[];
  occupations: FilterOption[];
  total: number;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const formRef = useRef<HTMLFormElement>(null);
  const firstRender = useRef(true);

  const state: FilterState = {
    category: searchParams.get('category') ?? undefined,
    tag: searchParams.get('tag') ?? undefined,
    period: searchParams.get('period') ?? undefined,
    country: searchParams.get('country') ?? undefined,
    occupation: searchParams.get('occupation') ?? undefined,
    living: searchParams.get('living') ?? undefined,
    sort: searchParams.get('sort') ?? undefined,
    q: searchParams.get('q') ?? undefined,
  };

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    const form = formRef.current;
    if (!form) return;

    const data = new FormData(form);
    const params = new URLSearchParams();
    for (const [key, value] of data.entries()) {
      const text = String(value).trim();
      if (text) params.set(key, text);
    }
    params.delete('page');
    const query = params.toString();
    router.push(query ? `/explore?${query}` : '/explore', { scroll: false });
  }, [state.category, state.tag, state.period, state.country, state.occupation, state.living, state.sort, router]);

  const activeFilters = [
    state.category ? { key: 'category', label: 'Field' } : null,
    state.tag ? { key: 'tag', label: 'Tag' } : null,
    state.period ? { key: 'period', label: 'Era' } : null,
    state.country ? { key: 'country', label: 'Country' } : null,
    state.occupation ? { key: 'occupation', label: 'Profession' } : null,
    state.living ? { key: 'living', label: 'Status' } : null,
  ].filter((f): f is { key: string; label: string } => f !== null);

  return (
    <form ref={formRef} method="get" action="/explore" className="space-y-6">
      <div className="flex items-baseline justify-between">
        <p className="eyebrow">Refine</p>
        <p className="font-mono text-[11px] text-ink-faint">{total} shown</p>
      </div>

      {state.q ? (
        <div>
          <label htmlFor="filter-q" className="eyebrow block">
            Search
          </label>
          <input
            id="filter-q"
            name="q"
            type="search"
            defaultValue={state.q}
            placeholder="Name or alias"
            className="mt-2 h-9 w-full rounded-[var(--radius-md)] border border-rule bg-surface px-2.5 text-[13px] text-ink outline-none focus:border-accent"
          />
        </div>
      ) : null}

      <Select
        id="filter-category"
        name="category"
        label="Field"
        value={state.category}
        options={categories}
      />
      <Select id="filter-tag" name="tag" label="Tag" value={state.tag} options={tags} />
      <Select
        id="filter-period"
        name="period"
        label="Era"
        value={state.period}
        options={periods}
      />
      <Select
        id="filter-country"
        name="country"
        label="Country"
        value={state.country}
        options={countries}
      />
      <Select
        id="filter-occupation"
        name="occupation"
        label="Profession"
        value={state.occupation}
        options={occupations}
      />

      <div>
        <label htmlFor="filter-living" className="eyebrow block">
          Status
        </label>
        <select
          id="filter-living"
          name="living"
          defaultValue={state.living ?? ''}
          className="mt-2 h-9 w-full rounded-[var(--radius-md)] border border-rule bg-surface px-2 text-[13px] text-ink outline-none focus:border-accent"
        >
          <option value="">Anyone</option>
          <option value="living">Living</option>
          <option value="deceased">Deceased</option>
        </select>
      </div>

      <div>
        <label htmlFor="filter-sort" className="eyebrow block">
          Sort
        </label>
        <select
          id="filter-sort"
          name="sort"
          defaultValue={state.sort ?? 'featured'}
          className="mt-2 h-9 w-full rounded-[var(--radius-md)] border border-rule bg-surface px-2 text-[13px] text-ink outline-none focus:border-accent"
        >
          <option value="featured">Featured</option>
          <option value="alpha">Alphabetical</option>
          <option value="recent">Recently published</option>
          <option value="birth">Birth date</option>
        </select>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          className="h-9 rounded-[var(--radius-md)] bg-accent px-3.5 text-[13px] font-medium text-accent-ink transition-colors hover:bg-accent-hover"
        >
          Apply
        </button>
        {activeFilters.length > 0 ? (
          <a
            href="/explore"
            className="inline-flex items-center gap-1 text-[13px] text-ink-muted transition-colors hover:text-accent"
          >
            <X aria-hidden className="size-3.5" strokeWidth={2} />
            Clear
          </a>
        ) : null}
      </div>
    </form>
  );
}

function Select({
  id,
  name,
  label,
  value,
  options,
}: {
  id: string;
  name: string;
  label: string;
  value?: string;
  options: FilterOption[];
}) {
  if (options.length === 0) return null;

  return (
    <div>
      <label htmlFor={id} className="eyebrow block">
        {label}
      </label>
      <select
        id={id}
        name={name}
        defaultValue={value ?? ''}
        className="mt-2 h-9 w-full rounded-[var(--radius-md)] border border-rule bg-surface px-2 text-[13px] text-ink outline-none focus:border-accent"
      >
        <option value="">All {label.toLowerCase()}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
            {typeof option.count === 'number' ? ` (${option.count})` : ''}
          </option>
        ))}
      </select>
    </div>
  );
}

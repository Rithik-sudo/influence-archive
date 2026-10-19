import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/cn';

export function Breadcrumbs({
  items,
  className,
}: {
  items: { label: string; href?: string }[];
  className?: string;
}) {
  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="flex flex-wrap items-center gap-1.5 font-mono text-[11px] text-ink-faint">
        {items.map((item, index) => (
          <li key={`${item.label}-${index}`} className="flex items-center gap-1.5">
            {item.href ? (
              <Link href={item.href} className="transition-colors hover:text-accent">
                {item.label}
              </Link>
            ) : (
              <span aria-current="page" className="text-ink-muted">
                {item.label}
              </span>
            )}
            {index < items.length - 1 ? (
              <span aria-hidden className="text-rule-strong">
                /
              </span>
            ) : null}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function Pagination({
  page,
  pageCount,
  basePath,
  params = {},
  className,
}: {
  page: number;
  pageCount: number;
  basePath: string;
  params?: Record<string, string | undefined>;
  className?: string;
}) {
  if (pageCount <= 1) return null;

  function hrefFor(target: number): string {
    const search = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
      if (value) search.set(key, value);
    }
    if (target > 1) search.set('page', String(target));
    const query = search.toString();
    return query ? `${basePath}?${query}` : basePath;
  }

  const pages: number[] = [];
  const window = 2;
  for (let i = 1; i <= pageCount; i += 1) {
    if (i === 1 || i === pageCount || Math.abs(i - page) <= window) pages.push(i);
  }

  return (
    <nav aria-label="Pagination" className={cn('flex items-center justify-between gap-4', className)}>
      <Link
        href={hrefFor(Math.max(1, page - 1))}
        aria-disabled={page === 1}
        className={cn(
          'flex items-center gap-1 text-small text-ink-muted transition-colors hover:text-accent',
          page === 1 && 'pointer-events-none opacity-40',
        )}
      >
        <ChevronLeft aria-hidden className="size-4" strokeWidth={1.75} />
        Previous
      </Link>

      <ol className="flex items-center gap-1 font-mono text-[11px]">
        {pages.map((value, index) => {
          const previous = pages[index - 1];
          const showGap = previous !== undefined && value - previous > 1;

          return (
            <li key={value} className="flex items-center gap-1">
              {showGap ? <span className="px-1 text-ink-faint">…</span> : null}
              <Link
                href={hrefFor(value)}
                aria-current={value === page ? 'page' : undefined}
                className={cn(
                  'grid size-8 place-items-center rounded-[var(--radius-sm)] transition-colors',
                  value === page
                    ? 'bg-accent text-accent-ink'
                    : 'text-ink-muted hover:bg-surface-sunken hover:text-ink',
                )}
              >
                {value}
              </Link>
            </li>
          );
        })}
      </ol>

      <Link
        href={hrefFor(Math.min(pageCount, page + 1))}
        aria-disabled={page === pageCount}
        className={cn(
          'flex items-center gap-1 text-small text-ink-muted transition-colors hover:text-accent',
          page === pageCount && 'pointer-events-none opacity-40',
        )}
      >
        Next
        <ChevronRight aria-hidden className="size-4" strokeWidth={1.75} />
      </Link>
    </nav>
  );
}

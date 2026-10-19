import Link from 'next/link';
import { Search } from 'lucide-react';

/**
 * The hero search field. A plain GET form, so it works without JavaScript and
 * lands on the full search page.
 */
export function SearchField({
  className,
  placeholder = 'Search the archive',
  label = 'Search the archive',
}: {
  className?: string;
  placeholder?: string;
  label?: string;
}) {
  return (
    <form
      action="/search"
      method="get"
      role="search"
      className={`flex items-center gap-3 border-b border-rule-strong pb-2 transition-colors focus-within:border-accent ${className ?? ''}`}
    >
      <label htmlFor="hero-search" className="sr-only">
        {label}
      </label>
      <Search aria-hidden className="size-4 shrink-0 text-ink-faint" strokeWidth={1.75} />
      <input
        id="hero-search"
        type="search"
        name="q"
        placeholder={placeholder}
        className="h-8 w-full bg-transparent font-mono text-[13px] text-ink outline-none placeholder:text-ink-faint"
      />
      <button
        type="submit"
        className="shrink-0 font-mono text-[11px] uppercase tracking-[0.14em] text-ink-muted transition-colors hover:text-accent"
      >
        Search
      </button>
    </form>
  );
}

export function InlineSearchLink({ children }: { children: React.ReactNode }) {
  return (
    <Link href="/search" className="text-accent underline underline-offset-4">
      {children}
    </Link>
  );
}

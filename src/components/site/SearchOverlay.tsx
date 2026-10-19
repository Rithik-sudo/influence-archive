'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X } from 'lucide-react';

type SearchHit = {
  type: 'person' | 'article' | 'collection';
  slug: string;
  title: string;
  subtitle?: string;
};

type SearchResponse = {
  query: string;
  people: SearchHit[];
  articles: SearchHit[];
  collections: SearchHit[];
  total: number;
};

const GROUP_LABELS: Record<SearchHit['type'], string> = {
  person: 'People',
  article: 'Essays',
  collection: 'Collections',
};

export function SearchOverlay() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => {
    setOpen(false);
    setQuery('');
    setResults(null);
    setError(null);
    setActive(0);
  }, []);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      const isShortcut =
        (event.key === 'k' || event.key === 'K') && (event.metaKey || event.ctrlKey);
      if (isShortcut) {
        event.preventDefault();
        setOpen((value) => !value);
        return;
      }
      if (event.key === 'Escape' && open) {
        event.preventDefault();
        close();
      }
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, close]);

  useEffect(() => {
    if (open) {
      // Focus after the dialog is mounted so the caret lands in the field.
      const id = window.setTimeout(() => inputRef.current?.focus(), 10);
      return () => window.clearTimeout(id);
    }
    return undefined;
  }, [open]);

  useEffect(() => {
    const trimmed = query.trim();
    if (!open || trimmed.length < 2) {
      return undefined;
    }

    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(trimmed)}`, {
          signal: controller.signal,
        });
        if (!response.ok) throw new Error(`Search failed (${response.status})`);
        const data = (await response.json()) as SearchResponse;
        setResults(data);
        setActive(0);
      } catch (cause) {
        if ((cause as Error).name === 'AbortError') return;
        setError('Search is unavailable right now. Please try again.');
      } finally {
        setLoading(false);
      }
    }, 180);

    return () => {
      controller.abort();
      window.clearTimeout(timer);
    };
  }, [query, open]);

  const flat: SearchHit[] = results
    ? [...results.people, ...results.articles, ...results.collections]
    : [];

  function onQueryChange(value: string) {
    setQuery(value);
    if (value.trim().length < 2) {
      setResults(null);
      setLoading(false);
      setActive(0);
    }
  }

  function go(hit: SearchHit) {
    const base =
      hit.type === 'person'
        ? '/people'
        : hit.type === 'article'
          ? '/articles'
          : '/collections';
    close();
    router.push(`${base}/${hit.slug}`);
  }

  function onInputKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActive((value) => Math.min(value + 1, Math.max(flat.length - 1, 0)));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActive((value) => Math.max(value - 1, 0));
    } else if (event.key === 'Enter') {
      event.preventDefault();
      const hit = flat[active];
      if (hit) {
        go(hit);
      } else if (query.trim()) {
        close();
        router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      }
    }
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 rounded-[var(--radius-md)] border border-rule px-2.5 py-1.5 text-ink-muted transition-colors hover:border-rule-strong hover:text-ink"
      >
        <Search aria-hidden className="size-3.5" strokeWidth={2} />
        <span className="hidden text-small sm:inline">Search</span>
        <kbd className="hidden rounded-[3px] border border-rule px-1 font-mono text-[10px] text-ink-faint sm:inline">
          ⌘K
        </kbd>
      </button>
    );
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-[12vh]"
      role="dialog"
      aria-modal="true"
      aria-label="Search the archive"
    >
      <button
        type="button"
        className="absolute inset-0 cursor-default bg-ink/25 backdrop-blur-[2px]"
        onClick={close}
        tabIndex={-1}
        aria-hidden
      />
      <div
        ref={panelRef}
        className="relative w-full max-w-2xl overflow-hidden rounded-[var(--radius-lg)] border border-rule-strong bg-surface shadow-[var(--shadow-plate)]"
      >
        <div className="flex items-center gap-3 border-b border-rule px-4">
          <Search aria-hidden className="size-4 shrink-0 text-ink-faint" strokeWidth={2} />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            onKeyDown={onInputKeyDown}
            placeholder="Search names, ideas, fields…"
            aria-label="Search the archive"
            className="h-12 w-full bg-transparent text-body text-ink outline-none placeholder:text-ink-faint"
          />
          <button
            type="button"
            onClick={close}
            className="rounded-[3px] p-1 text-ink-faint transition-colors hover:text-ink"
          >
            <X aria-hidden className="size-4" strokeWidth={2} />
            <span className="sr-only">Close search</span>
          </button>
        </div>

        <div className="max-h-[55vh] overflow-y-auto">
          {error ? (
            <p className="px-4 py-6 text-small text-accent">{error}</p>
          ) : loading && !results ? (
            <p className="px-4 py-6 text-small text-ink-faint">Searching…</p>
          ) : !query.trim() ? (
            <p className="px-4 py-6 text-small text-ink-faint">
              Type at least two characters to search names, aliases, fields and essays.
            </p>
          ) : results && results.total === 0 ? (
            <div className="px-4 py-6">
              <p className="text-small text-ink-muted">
                No results for “{query.trim()}”.
              </p>
              <button
                type="button"
                onClick={() => {
                  close();
                  router.push(`/search?q=${encodeURIComponent(query.trim())}`);
                }}
                className="mt-3 text-small text-accent underline underline-offset-4"
              >
                Search the full archive instead
              </button>
            </div>
          ) : (
            <div className="py-1">
              {(['person', 'article', 'collection'] as const).map((type) => {
                const group = results
                  ? type === 'person'
                    ? results.people
                    : type === 'article'
                      ? results.articles
                      : results.collections
                  : [];
                if (group.length === 0) return null;
                return (
                  <div key={type} className="py-1">
                    <p className="eyebrow px-4 pb-1 pt-2">{GROUP_LABELS[type]}</p>
                    {group.map((hit) => {
                      const index = flat.indexOf(hit);
                      return (
                        <button
                          key={`${type}-${hit.slug}`}
                          type="button"
                          onMouseEnter={() => setActive(index)}
                          onClick={() => go(hit)}
                          className={`flex w-full flex-col items-start gap-0.5 px-4 py-2 text-left transition-colors ${
                            index === active ? 'bg-surface-sunken' : 'hover:bg-surface-sunken'
                          }`}
                        >
                          <span className="text-small font-medium text-ink">{hit.title}</span>
                          {hit.subtitle ? (
                            <span className="text-[13px] text-ink-faint">{hit.subtitle}</span>
                          ) : null}
                        </button>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-rule px-4 py-2">
          <p className="font-mono text-[11px] text-ink-faint">
            ↑↓ to navigate · ↵ to open · esc to close
          </p>
          <button
            type="button"
            onClick={() => {
              close();
              router.push(`/search?q=${encodeURIComponent(query.trim())}`);
            }}
            className="text-[13px] text-accent underline underline-offset-4"
          >
            Full search
          </button>
        </div>
      </div>
    </div>
  );
}

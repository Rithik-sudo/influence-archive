import type { Metadata } from 'next';
import Link from 'next/link';
import { searchAll } from '@/server/queries/search';
import { SearchField } from '@/components/content/SearchField';
import { EmptyState } from '@/components/ui/States';

export const metadata: Metadata = {
  title: 'Search',
  description: 'Search the archive by name, alias, field, tag, occupation or essay.',
  alternates: { canonical: '/search' },
  robots: { index: false, follow: true },
};

export const dynamic = 'force-dynamic';

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function SearchPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const raw = params.q;
  const query = (Array.isArray(raw) ? raw[0] : raw) ?? '';

  const results = query.trim()
    ? await searchAll(query, 24)
    : { query: '', people: [], articles: [], collections: [], total: 0 };

  return (
    <div className="mx-auto max-w-[1440px] px-5 py-10 sm:px-8 sm:py-14">
      <header className="border-b border-rule pb-8">
        <p className="eyebrow">Search</p>
        <h1 className="mt-3 text-title font-semibold text-ink">
          {query ? `Results for “${query}”` : 'Search the archive'}
        </h1>
        <SearchField className="mt-6 max-w-xl" />
      </header>

      {query.trim() && results.total === 0 ? (
        <EmptyState
          className="mt-10"
          title="No matches"
          description="Try a surname, an alternative name, a field such as “computing”, or a term like “ethics”."
          action={
            <Link
              href="/explore"
              className="inline-block rounded-[var(--radius-md)] bg-accent px-4 py-2 text-small font-medium text-accent-ink transition-colors hover:bg-accent-hover"
            >
              Browse the directory instead
            </Link>
          }
        />
      ) : null}

      {results.people.length > 0 ? (
        <section className="mt-12" aria-label="People">
          <h2 className="eyebrow border-t border-rule pt-4">People ({results.people.length})</h2>
          <ul className="mt-6 space-y-4">
            {results.people.map((person) => (
              <li key={person.slug} className="border-b border-rule pb-4">
                <h3 className="font-display text-[1.125rem] font-semibold">
                  <Link href={`/people/${person.slug}`} className="text-ink hover:text-accent">
                    {person.title}
                  </Link>
                </h3>
                {person.subtitle ? (
                  <p className="mt-1 line-clamp-2 text-[13.5px] text-ink-muted">
                    {person.subtitle}
                  </p>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {results.articles.length > 0 ? (
        <section className="mt-14" aria-label="Essays">
          <h2 className="eyebrow border-t border-rule pt-4">Essays ({results.articles.length})</h2>
          <ul className="mt-6 space-y-4">
            {results.articles.map((article) => (
              <li key={article.slug} className="border-b border-rule pb-4">
                <h3 className="font-display text-[1.125rem] font-semibold">
                  <Link href={`/articles/${article.slug}`} className="text-ink hover:text-accent">
                    {article.title}
                  </Link>
                </h3>
                {article.subtitle ? (
                  <p className="mt-1 text-[13.5px] text-ink-muted">{article.subtitle}</p>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {results.collections.length > 0 ? (
        <section className="mt-14" aria-label="Collections">
          <h2 className="eyebrow border-t border-rule pt-4">
            Collections ({results.collections.length})
          </h2>
          <ul className="mt-6 space-y-4">
            {results.collections.map((collection) => (
              <li key={collection.slug} className="border-b border-rule pb-4">
                <h3 className="font-display text-[1.125rem] font-semibold">
                  <Link
                    href={`/collections/${collection.slug}`}
                    className="text-ink hover:text-accent"
                  >
                    {collection.title}
                  </Link>
                </h3>
                {collection.subtitle ? (
                  <p className="mt-1 text-[13.5px] text-ink-muted">{collection.subtitle}</p>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}

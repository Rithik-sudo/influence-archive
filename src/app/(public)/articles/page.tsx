import type { Metadata } from 'next';
import { listArticles } from '@/server/queries/articles';
import { ArticleCard } from '@/components/content/Cards';
import { EmptyState } from '@/components/ui/States';

export const metadata: Metadata = {
  title: 'Essays',
  description:
    'Longer editorial pieces on ideas, movements, rivalries, inventions and the connections between disciplines.',
  alternates: { canonical: '/articles' },
};

export const dynamic = 'force-dynamic';

export default async function ArticlesPage() {
  const articles = await listArticles(60);

  return (
    <div className="mx-auto max-w-[1440px] px-5 py-10 sm:px-8 sm:py-14">
      <header className="border-b border-rule pb-8">
        <p className="eyebrow">Editorial</p>
        <h1 className="mt-3 text-title font-semibold text-ink">Essays</h1>
        <p className="mt-3 max-w-[58ch] text-lede leading-relaxed text-ink-muted">
          Longer pieces on ideas, movements and the links between people — written when a single
          profile is not enough to hold the argument.
        </p>
      </header>

      {articles.length > 0 ? (
        <ul className="mt-10 max-w-[68ch] space-y-9">
          {articles.map((article) => (
            <li key={article.id} className="border-b border-rule pb-9">
              <ArticleCard article={article} />
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState
          className="mt-10"
          title="No essays published yet"
          description="Longer editorial pieces will appear here as they are released."
        />
      )}
    </div>
  );
}

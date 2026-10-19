import type { Metadata } from 'next';
import { listCollections } from '@/server/queries/collections';
import { CollectionCard } from '@/components/content/Cards';
import { EmptyState } from '@/components/ui/States';

export const metadata: Metadata = {
  title: 'Collections',
  description:
    'Curated groupings of influential people: pioneers of computing, women who changed science, rivalries that reshaped history, and more.',
  alternates: { canonical: '/collections' },
};

export const dynamic = 'force-dynamic';

export default async function CollectionsPage() {
  const collections = await listCollections();

  return (
    <div className="mx-auto max-w-[1440px] px-5 py-10 sm:px-8 sm:py-14">
      <header className="border-b border-rule pb-8">
        <p className="eyebrow">Curated</p>
        <h1 className="mt-3 text-title font-semibold text-ink">Collections</h1>
        <p className="mt-3 max-w-[58ch] text-lede leading-relaxed text-ink-muted">
          Each collection is assembled by the editorial desk around a single idea: a body of work,
          a shared struggle, a field, a rivalry, a country.
        </p>
      </header>

      {collections.length > 0 ? (
        <div className="mt-10 grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {collections.map((collection) => (
            <CollectionCard key={collection.id} collection={collection} />
          ))}
        </div>
      ) : (
        <EmptyState
          className="mt-10"
          title="No collections published yet"
          description="Curated groupings will appear here once the editorial desk releases them."
        />
      )}
    </div>
  );
}

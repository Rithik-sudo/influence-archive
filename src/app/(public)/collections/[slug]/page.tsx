import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getCollectionBySlug } from '@/server/queries/collections';
import { PersonCard } from '@/components/content/PersonCard';
import { Prose } from '@/components/content/Prose';
import { Breadcrumbs } from '@/components/content/Navigation';
import { EmptyState } from '@/components/ui/States';
import { formatLifespanCompact } from '@/lib/format';

export const dynamic = 'force-dynamic';

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const collection = await getCollectionBySlug(slug);
  if (!collection) return { title: 'Collection not found' };

  return {
    title: collection.seoTitle ?? collection.title,
    description: collection.seoDescription ?? collection.description,
    alternates: { canonical: `/collections/${collection.slug}` },
    openGraph: {
      title: collection.title,
      description: collection.description,
      url: `/collections/${collection.slug}`,
    },
  };
}

export default async function CollectionPage({ params }: Params) {
  const { slug } = await params;
  const collection = await getCollectionBySlug(slug);
  if (!collection) notFound();

  const people = collection.items
    .map((item) => item.person)
    .filter((person): person is NonNullable<typeof person> => person !== null);
  const articles = collection.items
    .map((item) => item.article)
    .filter((article): article is NonNullable<typeof article> => article !== null);

  return (
    <div className="mx-auto max-w-[1440px] px-5 py-10 sm:px-8 sm:py-14">
      <Breadcrumbs
        items={[
          { label: 'Archive', href: '/' },
          { label: 'Collections', href: '/collections' },
          { label: collection.title },
        ]}
      />

      <header className="mt-8 border-b border-rule pb-8">
        <p className="eyebrow">Collection</p>
        <h1 className="mt-3 max-w-[20ch] text-title font-semibold text-ink">
          {collection.title}
        </h1>
        {collection.description ? (
          <p className="mt-4 max-w-[62ch] text-lede leading-relaxed text-ink-muted">
            {collection.description}
          </p>
        ) : null}
        <p className="mt-5 font-mono text-[11px] text-ink-faint">
          {collection.itemCount} {collection.itemCount === 1 ? 'entry' : 'entries'}
        </p>
      </header>

      {collection.introductionMd ? (
        <section className="max-w-[68ch] py-10">
          <Prose markdown={collection.introductionMd} />
        </section>
      ) : null}

      {people.length > 0 ? (
        <section aria-label="People in this collection">
          <h2 className="eyebrow border-t border-rule pt-4">In this collection</h2>
          <ol className="mt-8 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
            {people.map((person, index) => (
              <li key={person.id}>
                <p className="mb-2 font-mono text-[10.5px] text-ink-faint">
                  {String(index + 1).padStart(2, '0')}
                </p>
                <PersonCard person={person} />
                <p className="mt-1.5 font-mono text-[10.5px] text-ink-faint">
                  {formatLifespanCompact(
                    { date: person.birthDate, precision: person.birthPrecision },
                    { date: person.deathDate, precision: person.deathPrecision },
                    person.isLiving,
                  )}
                </p>
              </li>
            ))}
          </ol>
        </section>
      ) : null}

      {articles.length > 0 ? (
        <section aria-label="Essays in this collection" className="mt-14">
          <h2 className="eyebrow border-t border-rule pt-4">Related reading</h2>
          <ul className="mt-6 space-y-5">
            {articles.map((article) => (
              <li key={article.slug} className="border-b border-rule pb-5">
                <h3 className="font-display text-[1.125rem] font-semibold">
                  <Link href={`/articles/${article.slug}`} className="text-ink hover:text-accent">
                    {article.title}
                  </Link>
                </h3>
                {article.summary ? (
                  <p className="mt-1.5 text-[13.5px] leading-relaxed text-ink-muted">
                    {article.summary}
                  </p>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {people.length === 0 && articles.length === 0 ? (
        <EmptyState
          className="mt-10"
          title="This collection is empty"
          description="Its contents have not been published yet."
        />
      ) : null}
    </div>
  );
}

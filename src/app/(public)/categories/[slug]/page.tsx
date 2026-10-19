import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getCategoryBySlug, listCategories } from '@/server/queries/categories';
import { listPeople } from '@/server/queries/people';
import { PersonCard } from '@/components/content/PersonCard';
import { Breadcrumbs } from '@/components/content/Navigation';
import { EmptyState } from '@/components/ui/States';

export const dynamic = 'force-dynamic';

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) return { title: 'Field not found' };

  return {
    title: category.seoTitle ?? category.name,
    description: category.seoDescription ?? category.description,
    alternates: { canonical: `/categories/${category.slug}` },
    openGraph: {
      title: category.name,
      description: category.description,
      url: `/categories/${category.slug}`,
    },
  };
}

export default async function CategoryPage({ params }: Params) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) notFound();

  const result = await listPeople({ category: slug, perPage: 60, sort: 'featured' });
  const allCategories = await listCategories();
  const parent = category.parentId
    ? allCategories.find((c) => c.id === category.parentId)
    : undefined;
  const children = allCategories.filter((c) => c.parentId === category.id);

  return (
    <div className="mx-auto max-w-[1440px] px-5 py-10 sm:px-8 sm:py-14">
      <Breadcrumbs
        items={[
          { label: 'Archive', href: '/' },
          { label: 'Fields', href: '/categories' },
          ...(parent ? [{ label: parent.name, href: `/categories/${parent.slug}` }] : []),
          { label: category.name },
        ]}
      />

      <header className="mt-8 border-b border-rule pb-8">
        <p className="eyebrow">Field</p>
        <h1 className="mt-3 text-title font-semibold text-ink">{category.name}</h1>
        {category.description ? (
          <p className="mt-4 max-w-[62ch] text-lede leading-relaxed text-ink-muted">
            {category.description}
          </p>
        ) : null}
        <p className="mt-5 font-mono text-[11px] text-ink-faint">
          {result.total} {result.total === 1 ? 'profile' : 'profiles'}
        </p>
      </header>

      {children.length > 0 ? (
        <nav aria-label="Sub-fields" className="mt-8">
          <p className="eyebrow">Within {category.name}</p>
          <ul className="mt-3 flex flex-wrap gap-2.5">
            {children.map((child) => (
              <li key={child.id}>
                <Link
                  href={`/categories/${child.slug}`}
                  className="inline-flex items-baseline gap-2 rounded-[var(--radius-sm)] border border-rule bg-surface px-3 py-1.5 text-[13px] text-ink transition-colors hover:border-accent hover:text-accent"
                >
                  {child.name}
                  <span className="font-mono text-[10.5px] text-ink-faint">
                    {child.personCount}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}

      <section className="mt-12" aria-label="Profiles in this field">
        {result.items.length > 0 ? (
          <ul className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
            {result.items.map((person) => (
              <li key={person.id}>
                <PersonCard person={person} />
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState
            title="No published profiles in this field yet"
            description="The editorial desk is still preparing this section."
            action={
              <Link
                href="/explore"
                className="inline-block rounded-[var(--radius-md)] bg-accent px-4 py-2 text-small font-medium text-accent-ink transition-colors hover:bg-accent-hover"
              >
                Browse the whole archive
              </Link>
            }
          />
        )}
      </section>
    </div>
  );
}

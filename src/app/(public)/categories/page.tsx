import type { Metadata } from 'next';
import Link from 'next/link';
import { listCategories } from '@/server/queries/categories';
import { EmptyState } from '@/components/ui/States';

export const metadata: Metadata = {
  title: 'Fields',
  description:
    'Browse the archive by field: science and technology, philosophy, art, politics, medicine, mathematics and more.',
  alternates: { canonical: '/categories' },
};

export const dynamic = 'force-dynamic';

export default async function CategoriesPage() {
  const categories = await listCategories();
  const withContent = categories.filter((category) => category.personCount > 0);
  const parents = categories.filter((category) => !category.parentId);

  return (
    <div className="mx-auto max-w-[1440px] px-5 py-10 sm:px-8 sm:py-14">
      <header className="border-b border-rule pb-8">
        <p className="eyebrow">Taxonomy</p>
        <h1 className="mt-3 text-title font-semibold text-ink">Fields</h1>
        <p className="mt-3 max-w-[58ch] text-lede leading-relaxed text-ink-muted">
          People rarely belong to a single field. These are the primary routes into the archive,
          and every profile sits under several of them.
        </p>
      </header>

      {parents.length > 0 ? (
        <ul className="mt-10 grid gap-x-12 gap-y-0 sm:grid-cols-2 lg:grid-cols-3">
          {parents.map((category) => (
            <li key={category.id}>
              <Link
                href={`/categories/${category.slug}`}
                className="group flex items-baseline justify-between gap-4 border-b border-rule py-4 transition-colors"
              >
                <span>
                  <span className="block font-display text-[1.25rem] font-semibold text-ink transition-colors group-hover:text-accent">
                    {category.name}
                  </span>
                  {category.description ? (
                    <span className="mt-1 block max-w-[42ch] text-[13px] leading-relaxed text-ink-muted">
                      {category.description}
                    </span>
                  ) : null}
                </span>
                <span className="shrink-0 font-mono text-[11px] text-ink-faint">
                  {category.personCount}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState
          className="mt-10"
          title="No fields published yet"
          description="The taxonomy is being prepared by the editorial desk."
        />
      )}

      {withContent.length > 0 && parents.length > 0 ? (
        <p className="mt-10 font-mono text-[11px] text-ink-faint">
          {withContent.length} of {parents.length} fields currently hold published profiles.
        </p>
      ) : null}
    </div>
  );
}

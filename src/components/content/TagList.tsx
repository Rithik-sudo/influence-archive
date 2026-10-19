import Link from 'next/link';
import { cn } from '@/lib/cn';

export function TagList({
  tags,
  className,
  size = 'sm',
}: {
  tags: { slug: string; name: string }[];
  className?: string;
  size?: 'sm' | 'xs';
}) {
  if (tags.length === 0) return null;

  return (
    <ul className={cn('flex flex-wrap gap-x-2 gap-y-1', className)}>
      {tags.map((tag) => (
        <li key={tag.slug}>
          <Link
            href={`/explore?tag=${tag.slug}`}
            className={cn(
              'text-ink-faint transition-colors hover:text-accent',
              size === 'sm' ? 'text-[12px]' : 'text-[11px]',
            )}
          >
            #{tag.name}
          </Link>
        </li>
      ))}
    </ul>
  );
}

export function CategoryLinks({
  categories,
  className,
}: {
  categories: { slug: string; name: string }[];
  className?: string;
}) {
  if (categories.length === 0) return null;

  return (
    <ul className={cn('flex flex-wrap gap-2', className)}>
      {categories.map((category) => (
        <li key={category.slug}>
          <Link
            href={`/categories/${category.slug}`}
            className="inline-block rounded-[var(--radius-sm)] bg-sage-soft px-2 py-0.5 text-[11px] font-medium tracking-[0.02em] text-sage-deep transition-colors hover:bg-sage hover:text-ink"
          >
            {category.name}
          </Link>
        </li>
      ))}
    </ul>
  );
}

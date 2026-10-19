import Link from 'next/link';
import { Portrait } from './Portrait';
import { cn } from '@/lib/cn';

export function CollectionCard({
  collection,
  className,
  showCount = true,
}: {
  collection: {
    slug: string;
    title: string;
    description: string;
    itemCount: number;
    cover: { path: string; url: string; altText: string } | null;
  };
  className?: string;
  showCount?: boolean;
}) {
  return (
    <Link
      href={`/collections/${collection.slug}`}
      className={cn(
        'group flex h-full flex-col border-t border-rule pt-4 transition-colors',
        className,
      )}
    >
      {collection.cover ? (
        <Portrait
          media={{
            path: collection.cover.path,
            url: collection.cover.url,
            altText: collection.cover.altText,
            caption: null,
            artist: null,
            credit: null,
            licenseName: null,
            licenseUrl: null,
            sourcePageUrl: null,
            width: null,
            height: null,
          }}
          name={collection.title}
          sizes="(max-width: 640px) 100vw, 33vw"
          className="mb-4 aspect-[16/10] w-full"
          imageClassName="transition-transform duration-500 ease-out group-hover:scale-[1.03]"
        />
      ) : null}
      <h3 className="font-display text-[1.1875rem] font-semibold leading-snug text-ink transition-colors group-hover:text-accent">
        {collection.title}
      </h3>
      <p className="mt-2 flex-1 text-[13.5px] leading-relaxed text-ink-muted">
        {collection.description}
      </p>
      {showCount ? (
        <p className="mt-3 font-mono text-[11px] text-ink-faint">
          {collection.itemCount} {collection.itemCount === 1 ? 'entry' : 'entries'}
        </p>
      ) : null}
    </Link>
  );
}

export function ArticleCard({
  article,
  className,
  variant = 'row',
}: {
  article: {
    slug: string;
    title: string;
    summary: string;
    publishedAt: Date | null;
    hero: { path: string; url: string; altText: string } | null;
  };
  className?: string;
  variant?: 'row' | 'plain';
}) {
  const date = article.publishedAt
    ? new Intl.DateTimeFormat('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        timeZone: 'UTC',
      }).format(article.publishedAt)
    : '';

  if (variant === 'plain') {
    return (
      <article className={cn('border-t border-rule pt-3', className)}>
        <p className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-accent">Essay</p>
        <h3 className="mt-1.5 font-display text-[1.125rem] font-semibold leading-snug">
          <Link href={`/articles/${article.slug}`} className="text-ink hover:text-accent">
            {article.title}
          </Link>
        </h3>
        <p className="mt-1.5 line-clamp-3 text-[13.5px] leading-relaxed text-ink-muted">
          {article.summary}
        </p>
        {date ? <p className="mt-2 font-mono text-[11px] text-ink-faint">{date}</p> : null}
      </article>
    );
  }

  return (
    <article className={cn('group', className)}>
      <Link href={`/articles/${article.slug}`} className="flex gap-5">
        {article.hero ? (
          <Portrait
            media={{
              path: article.hero.path,
              url: article.hero.url,
              altText: article.hero.altText,
              caption: null,
              artist: null,
              credit: null,
              licenseName: null,
              licenseUrl: null,
              sourcePageUrl: null,
              width: null,
              height: null,
            }}
            name={article.title}
            sizes="160px"
            className="hidden size-28 shrink-0 sm:block"
            imageClassName="transition-transform duration-500 ease-out group-hover:scale-[1.03]"
          />
        ) : null}
        <div className="min-w-0">
          <h3 className="font-display text-[1.1875rem] font-semibold leading-snug text-ink transition-colors group-hover:text-accent">
            {article.title}
          </h3>
          <p className="mt-1.5 line-clamp-2 text-[13.5px] leading-relaxed text-ink-muted">
            {article.summary}
          </p>
          {date ? <p className="mt-2 font-mono text-[11px] text-ink-faint">{date}</p> : null}
        </div>
      </Link>
    </article>
  );
}

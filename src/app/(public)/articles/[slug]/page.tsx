import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getArticleBySlug } from '@/server/queries/articles';
import { Prose } from '@/components/content/Prose';
import { Portrait } from '@/components/content/Portrait';
import { SourceList } from '@/components/content/SourceList';
import { Breadcrumbs } from '@/components/content/Navigation';
import { ReadingProgress } from '@/components/content/ReadingProgress';
import { ShareButton } from '@/components/content/ShareButton';
import { SectionHeading } from '@/components/content/SectionHeading';
import { renderMarkdown, excerptFrom } from '@/lib/content/markdown';
import { formatPublishedDate } from '@/lib/format';

export const dynamic = 'force-dynamic';

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return { title: 'Essay not found' };

  const title = article.seoTitle ?? article.title;
  const description = article.seoDescription ?? excerptFrom(article.summary, 200);

  return {
    title,
    description,
    alternates: { canonical: `/articles/${article.slug}` },
    openGraph: {
      type: 'article',
      title,
      description,
      url: `/articles/${article.slug}`,
      publishedTime: article.publishedAt?.toISOString(),
      modifiedTime: article.updatedAt?.toISOString(),
      images: article.hero ? [{ url: article.hero.url, alt: article.hero.altText }] : undefined,
    },
  };
}

export default async function ArticlePage({ params }: Params) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) notFound();

  const { toc } = renderMarkdown(article.contentMd);

  return (
    <>
      <ReadingProgress />

      <article className="mx-auto max-w-[1440px] px-5 pt-8 sm:px-8">
        <Breadcrumbs
          items={[
            { label: 'Archive', href: '/' },
            { label: 'Essays', href: '/articles' },
            { label: article.title },
          ]}
        />

        <header className="mx-auto mt-8 max-w-[68ch] border-b border-rule pb-10">
          <p className="eyebrow">Essay</p>
          <h1 className="mt-3 text-title font-semibold text-ink">{article.title}</h1>
          {article.summary ? (
            <p className="mt-5 text-lede leading-relaxed text-ink-muted">{article.summary}</p>
          ) : null}
          <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2">
            <p className="font-mono text-[11px] text-ink-faint">
              {formatPublishedDate(article.publishedAt)}
            </p>
            <ShareButton title={article.title} />
          </div>
        </header>

        {article.hero ? (
          <figure className="mx-auto mt-10 max-w-[52rem]">
            <Portrait
              media={article.hero}
              name={article.title}
              priority
              sizes="(max-width: 1024px) 100vw, 52rem"
              className="aspect-[16/9] w-full"
            />
            <figcaption className="mt-2.5 border-t border-rule pt-2 font-mono text-[10.5px] text-ink-faint">
              {article.hero.caption ?? article.title}
              {article.hero.credit ? ` · ${article.hero.credit}` : ''}
              {article.hero.licenseName ? ` · ${article.hero.licenseName}` : ''}
            </figcaption>
          </figure>
        ) : null}

        <div className="grid gap-12 py-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,14rem)] lg:gap-16">
          <div className="min-w-0">
            <Prose markdown={article.contentMd} className="max-w-[68ch]" />

            {article.sources.length > 0 ? (
              <section id="sources" className="mt-14 scroll-mt-24">
                <SectionHeading title="Sources" className="mb-6" />
                <SourceList sources={article.sources.map((source) => ({ ...source, notes: null }))} />
              </section>
            ) : null}

            {article.relatedPeople.length > 0 ? (
              <section className="mt-14">
                <SectionHeading title="People in this essay" className="mb-6" />
                <ul className="flex flex-wrap gap-3">
                  {article.relatedPeople.map((person) => (
                    <li key={person.slug}>
                      <Link
                        href={`/people/${person.slug}`}
                        className="flex items-center gap-2.5 rounded-[var(--radius-md)] border border-rule bg-surface px-3 py-2 transition-colors hover:border-accent"
                      >
                        <Portrait
                          media={person.portrait}
                          name={person.fullName}
                          className="size-9 shrink-0"
                          sizes="36px"
                        />
                        <span className="text-[13px] text-ink">{person.fullName}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            {article.relatedArticles.length > 0 ? (
              <section className="mt-14">
                <SectionHeading title="Read next" className="mb-6" />
                <ul className="space-y-4">
                  {article.relatedArticles.map((related) => (
                    <li key={related.slug} className="border-b border-rule pb-4">
                      <Link
                        href={`/articles/${related.slug}`}
                        className="font-display text-[1.0625rem] font-semibold text-ink hover:text-accent"
                      >
                        {related.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}
          </div>

          <aside className="hidden lg:block">
            <div className="sticky top-24 space-y-8">
              {toc.length > 1 ? (
                <nav aria-label="On this page">
                  <p className="eyebrow">On this page</p>
                  <ol className="mt-3 space-y-2 border-l border-rule pl-4">
                    {toc.map((entry) => (
                      <li key={entry.id}>
                        <a
                          href={`#${entry.id}`}
                          className={`block text-[12.5px] leading-snug text-ink-muted transition-colors hover:text-accent ${
                            entry.level === 3 ? 'pl-3 text-ink-faint' : ''
                          }`}
                        >
                          {entry.text}
                        </a>
                      </li>
                    ))}
                  </ol>
                </nav>
              ) : null}

              {article.categories.length > 0 ? (
                <div>
                  <p className="eyebrow">Fields</p>
                  <ul className="mt-3 space-y-1.5">
                    {article.categories.map((category) => (
                      <li key={category.slug}>
                        <Link
                          href={`/categories/${category.slug}`}
                          className="text-[12.5px] text-ink-muted transition-colors hover:text-accent"
                        >
                          {category.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          </aside>
        </div>
      </article>
    </>
  );
}

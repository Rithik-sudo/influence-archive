import Link from 'next/link';
import { getFeaturedPeople, getRecentlyPublished, listPeople } from '@/server/queries/people';
import { listCategoryCounts } from '@/server/queries/categories';
import { listCollections } from '@/server/queries/collections';
import { listArticles } from '@/server/queries/articles';
import { listPeriods } from '@/server/queries/search';
import { getBrand } from '@/server/queries/site';
import { SectionHeading } from '@/components/content/SectionHeading';
import { FeaturedFigure, HeroFigure, TextLink } from '@/components/content/FrontPage';
import { CollectionCard, ArticleCard } from '@/components/content/Cards';
import { SearchField } from '@/components/content/SearchField';
import { Portrait } from '@/components/content/Portrait';
import { EmptyState } from '@/components/ui/States';
import { formatLifespanCompact } from '@/lib/format';
import { discoverAction } from './discover/actions';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const [brand, featured, categories, collections, articles, periods, recent, everyone] =
    await Promise.all([
      getBrand(),
      getFeaturedPeople(4),
      listCategoryCounts(),
      listCollections(),
      listArticles(3),
      listPeriods(),
      getRecentlyPublished(5),
      listPeople({ perPage: 1 }),
    ]);

  const [lead, ...supporting] = featured;
  const featuredCategories = categories.filter((c) => c.count > 0);

  const hasContent = categories.some((c) => c.count > 0);

  return (
    <>
      {/* ---------------------------------------------------------- hero */}
      <section className="border-b border-rule">
        <div className="mx-auto max-w-[1440px] px-5 pb-14 pt-12 sm:px-8 sm:pt-16">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)] lg:gap-16">
            <div className="flex flex-col justify-center">
              <p className="eyebrow">{brand.tagline}</p>
              <h1 className="mt-5 max-w-[18ch] text-display font-semibold text-ink">
                {brand.homeHeadline}
              </h1>
              <p className="mt-6 max-w-[46ch] text-lede leading-relaxed text-ink-muted">
                {brand.homeStandfirst}
              </p>

              <SearchField className="mt-9 max-w-md" />

              <p className="mt-4 text-[13px] text-ink-faint">
                {hasContent
                  ? `Browse ${everyone.total} ${
                      everyone.total === 1 ? 'profile' : 'profiles'
                    } across ${featuredCategories.length} fields.`
                  : 'The archive is being prepared. New profiles are added every week.'}
              </p>
            </div>

            {lead ? (
              <div className="lg:justify-self-end">
                <HeroFigure person={lead} />
              </div>
            ) : null}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------ featured figures */}
      {featured.length > 0 ? (
        <section className="mx-auto max-w-[1440px] px-5 py-[var(--spacing-section)] sm:px-8">
          <SectionHeading
            index="01"
            title="Featured figures"
            action={<TextLink href="/explore">View all figures</TextLink>}
          />

          <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-14">
            {lead ? (
              <FeaturedFigure person={lead} rank="Plate 01 — Lead feature" />
            ) : null}

            <div className="grid gap-8 sm:grid-cols-2 lg:content-start">
              {supporting.map((person) => (
                <article key={person.id} className="group">
                  <Link href={`/people/${person.slug}`} className="block">
                    <Portrait
                      media={person.portrait}
                      name={person.fullName}
                      sizes="(max-width: 640px) 45vw, 24vw"
                      className="aspect-[4/5] w-full"
                      imageClassName="transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                    />
                    <h3 className="mt-3 font-display text-[1.0625rem] font-semibold leading-snug text-ink transition-colors group-hover:text-accent">
                      {person.fullName}
                    </h3>
                    <p className="mt-0.5 font-mono text-[11px] text-ink-faint">
                      {formatLifespanCompact(
                        { date: person.birthDate, precision: person.birthPrecision },
                        { date: person.deathDate, precision: person.deathPrecision },
                        person.isLiving,
                      )}
                    </p>
                    <p className="mt-1.5 line-clamp-2 text-[13px] leading-relaxed text-ink-muted">
                      {person.summary}
                    </p>
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* ------------------------------------------------------ by field */}
      {featuredCategories.length > 0 ? (
        <section className="border-t border-rule bg-surface">
          <div className="mx-auto max-w-[1440px] px-5 py-[var(--spacing-section)] sm:px-8">
            <SectionHeading
              index="02"
              title="Explore by field"
              action={<TextLink href="/categories">All fields</TextLink>}
            />
            <ul className="mt-8 grid gap-x-10 gap-y-0 sm:grid-cols-2 lg:grid-cols-3">
              {featuredCategories.map((category) => (
                <li key={category.slug}>
                  <Link
                    href={`/categories/${category.slug}`}
                    className="group flex items-baseline justify-between gap-4 border-b border-rule py-3.5 transition-colors"
                  >
                    <span className="font-display text-[1.0625rem] font-medium text-ink transition-colors group-hover:text-accent">
                      {category.name}
                    </span>
                    <span className="font-mono text-[11px] text-ink-faint">
                      {category.count}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      {/* --------------------------------------------------- collections */}
      {collections.length > 0 ? (
        <section className="mx-auto max-w-[1440px] px-5 py-[var(--spacing-section)] sm:px-8">
          <SectionHeading
            index="03"
            title="Curated collections"
            action={<TextLink href="/collections">All collections</TextLink>}
          />
          <div className="mt-8 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {collections.slice(0, 3).map((collection) => (
              <CollectionCard key={collection.id} collection={collection} />
            ))}
          </div>
        </section>
      ) : null}

      {/* ----------------------------------------------------- by era */}
      {periods.length > 0 ? (
        <section className="border-t border-rule bg-surface">
          <div className="mx-auto max-w-[1440px] px-5 py-[var(--spacing-section)] sm:px-8">
            <SectionHeading
              index="04"
              title="By era"
              action={<TextLink href="/explore">Browse chronologically</TextLink>}
            />
            <ul className="mt-8 flex flex-wrap gap-2.5">
              {periods.map((period) => (
                <li key={period.slug}>
                  <Link
                    href={`/explore?period=${period.slug}`}
                    className="inline-flex items-baseline gap-2 rounded-[var(--radius-sm)] border border-rule bg-paper px-3 py-1.5 text-[13px] text-ink transition-colors hover:border-accent hover:text-accent"
                  >
                    {period.name}
                    <span className="font-mono text-[10.5px] text-ink-faint">
                      {period.startYear}–{period.endYear}
                    </span>
                    <span className="font-mono text-[10.5px] text-accent">{period.count}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      {/* ----------------------------------------- recently added + essays */}
      <section className="mx-auto max-w-[1440px] px-5 py-[var(--spacing-section)] sm:px-8">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] lg:gap-16">
          <div>
            <SectionHeading index="05" title="Recently added" />
            {recent.length > 0 ? (
              <ul className="mt-6">
                {recent.map((person) => (
                  <li key={person.id} className="border-b border-rule">
                    <Link
                      href={`/people/${person.slug}`}
                      className="group flex items-baseline justify-between gap-4 py-3.5"
                    >
                      <span className="font-display text-[1.0625rem] font-medium text-ink transition-colors group-hover:text-accent">
                        {person.fullName}
                      </span>
                      <span className="shrink-0 font-mono text-[11px] text-ink-faint">
                        {formatLifespanCompact(
                          { date: person.birthDate, precision: person.birthPrecision },
                          { date: person.deathDate, precision: person.deathPrecision },
                          person.isLiving,
                        )}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyState
                className="mt-6"
                title="No profiles published yet"
                description="The archive is being prepared. Published profiles will appear here as they are released."
              />
            )}

            <form action={discoverAction} className="mt-8">
              <button
                type="submit"
                className="group inline-flex items-center gap-2 rounded-[var(--radius-md)] border border-rule-strong px-4 py-2.5 text-small text-ink transition-colors hover:border-accent hover:text-accent"
              >
                <span
                  aria-hidden
                  className="inline-block size-3.5 rounded-full border border-current transition-transform duration-500 group-hover:rotate-180"
                  style={{ borderStyle: 'dashed' }}
                />
                Discover someone
              </button>
            </form>
          </div>

          <div>
            <SectionHeading index="06" title="Essays" />
            {articles.length > 0 ? (
              <div className="mt-6 space-y-7">
                {articles.map((article) => (
                  <ArticleCard key={article.id} article={article} variant="plain" />
                ))}
              </div>
            ) : (
              <EmptyState
                className="mt-6"
                title="No essays yet"
                description="Longer editorial pieces on ideas, movements and rivalries will appear here."
              />
            )}
          </div>
        </div>
      </section>
    </>
  );
}

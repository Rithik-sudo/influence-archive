import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPersonBySlug, getSimilarPeople } from '@/server/queries/people';
import { listCategories } from '@/server/queries/categories';
import { renderMarkdown, excerptFrom } from '@/lib/content/markdown';
import { formatDate, formatLifespan, ageAtDeath } from '@/lib/format';
import { Breadcrumbs } from '@/components/content/Navigation';
import { Portrait } from '@/components/content/Portrait';
import { Prose } from '@/components/content/Prose';
import { Timeline } from '@/components/content/Timeline';
import { SourceList } from '@/components/content/SourceList';
import { RelatedPeople } from '@/components/content/RelatedPeople';
import { CategoryLinks, TagList } from '@/components/content/TagList';
import { SectionHeading } from '@/components/content/SectionHeading';
import { ReadingProgress } from '@/components/content/ReadingProgress';
import { ShareButton } from '@/components/content/ShareButton';
import { EmptyState } from '@/components/ui/States';

export const dynamic = 'force-dynamic';

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const person = await getPersonBySlug(slug);
  if (!person) return { title: 'Profile not found' };

  const title = person.seoTitle ?? `${person.fullName}`;
  const description =
    person.seoDescription ??
    excerptFrom(person.summary || person.whyItMatters || person.biographyMd, 200);

  const canonical = `/people/${person.slug}`;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      type: 'profile',
      title,
      description,
      url: canonical,
      images: person.portrait
        ? [{ url: person.portrait.url, alt: person.portrait.altText }]
        : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

function jsonLd(person: NonNullable<Awaited<ReturnType<typeof getPersonBySlug>>>) {
  const site = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: person.fullName,
    alternateName: person.alternateNames,
    description: person.summary,
    birthDate: person.birthDate ?? undefined,
    deathDate: person.deathDate ?? undefined,
    nationality: person.nationality ?? undefined,
    jobTitle: person.occupations,
    url: `${site}/people/${person.slug}`,
    image: person.portrait ? `${site}${person.portrait.url}` : undefined,
    knowsAbout: person.tags.map((tag) => tag.name),
  };
}

export default async function PersonPage({ params }: Params) {
  const { slug } = await params;
  const person = await getPersonBySlug(slug);
  if (!person) notFound();

  const categories = await listCategories();
  const primaryCategory = person.categories[0];
  const breadcrumbCategory = primaryCategory
    ? categories.find((c) => c.slug === primaryCategory.slug)
    : undefined;

  const similar = person.related.length > 0 ? [] : await getSimilarPeople(person.id, 4);

  const biography = renderMarkdown(person.biographyMd);
  const contributions = renderMarkdown(person.contributionsMd);
  const ideas = renderMarkdown(person.ideasMd);
  const controversies = renderMarkdown(person.controversiesMd);
  const legacy = renderMarkdown(person.legacyMd);

  const age = ageAtDeath(
    { date: person.birthDate, precision: person.birthPrecision },
    { date: person.deathDate, precision: person.deathPrecision },
  );

  const sections = [
    { id: 'origins', title: 'Life and work', body: person.biographyMd, rendered: biography },
    {
      id: 'contributions',
      title: 'Contributions and major works',
      body: person.contributionsMd,
      rendered: contributions,
    },
    { id: 'ideas', title: 'Ideas and beliefs', body: person.ideasMd, rendered: ideas },
    {
      id: 'controversies',
      title: 'Challenges, failures and controversies',
      body: person.controversiesMd,
      rendered: controversies,
    },
    { id: 'legacy', title: 'Legacy and modern relevance', body: person.legacyMd, rendered: legacy },
  ].filter((section) => section.rendered.html.length > 0);

  return (
    <>
      <ReadingProgress />

      <article className="mx-auto max-w-[1440px] px-5 pt-8 sm:px-8">
        <Breadcrumbs
          items={[
            { label: 'Archive', href: '/' },
            { label: 'People', href: '/explore' },
            ...(breadcrumbCategory
              ? [{ label: breadcrumbCategory.name, href: `/categories/${breadcrumbCategory.slug}` }]
              : []),
            { label: person.fullName },
          ]}
        />

        {/* ------------------------------------------------------ masthead */}
        <header className="mt-8 grid gap-10 border-b border-rule pb-12 lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)] lg:gap-16">
          <figure>
            <Portrait
              media={person.portrait}
              name={person.fullName}
              priority
              sizes="(max-width: 1024px) 60vw, 320px"
              className="aspect-[4/5] w-full max-w-sm"
            />
            {person.portrait ? (
              <figcaption className="mt-2.5 border-t border-rule pt-2 font-mono text-[10.5px] leading-relaxed text-ink-faint">
                {person.portrait.caption ?? person.fullName}
                {person.portrait.artist ? ` · ${person.portrait.artist}` : ''}
                {person.portrait.licenseName ? ` · ${person.portrait.licenseName}` : ''}
                {person.portrait.sourcePageUrl ? (
                  <>
                    {' · '}
                    <a
                      href={person.portrait.sourcePageUrl}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="underline underline-offset-2 hover:text-accent"
                    >
                      source
                    </a>
                  </>
                ) : null}
              </figcaption>
            ) : null}
          </figure>

          <div className="flex flex-col justify-center">
            <p className="eyebrow">{primaryCategory?.name ?? 'Profile'}</p>
            <h1 className="mt-3 text-title font-semibold text-ink">{person.fullName}</h1>

            {person.alternateNames.length > 0 ? (
              <p className="mt-2 text-[13.5px] italic text-ink-faint">
                Also known as {person.alternateNames.join('; ')}
              </p>
            ) : null}

            <p className="mt-4 font-mono text-[12px] text-ink-muted">
              {formatLifespan(
                { date: person.birthDate, precision: person.birthPrecision },
                { date: person.deathDate, precision: person.deathPrecision },
                person.isLiving,
              )}
              {age !== null ? ` (aged ${age})` : ''}
              {person.nationality ? ` · ${person.nationality}` : ''}
            </p>

            {person.occupations.length > 0 ? (
              <p className="mt-1.5 text-[13.5px] italic text-ink-muted">
                {person.occupations.join(' · ')}
              </p>
            ) : null}

            {/* The dossier: the record at a glance, the way a catalogue card
                presents it. Only the fields the record actually supports. */}
            <p className="eyebrow mt-7">Dossier</p>
            <dl className="mt-3 grid max-w-md grid-cols-[8rem_1fr] gap-x-6 gap-y-2 border-y border-rule py-4">
              <dt className="eyebrow pt-0.5">Born</dt>
              <dd className="text-[13.5px] text-ink">
                {formatDate(person.birthDate, person.birthPrecision) || 'Not recorded'}
              </dd>

              <dt className="eyebrow pt-0.5">
                {person.isLiving ? 'Born' : 'Died'}
              </dt>
              <dd className="text-[13.5px] text-ink">
                {person.isLiving
                  ? 'Living'
                  : formatDate(person.deathDate, person.deathPrecision) || 'Not recorded'}
                {age !== null ? ` · aged ${age}` : ''}
              </dd>

              <dt className="eyebrow pt-0.5">Known for</dt>
              <dd className="text-[13.5px] text-ink">
                {person.occupations.length > 0 ? person.occupations.join(', ') : 'Not recorded'}
              </dd>

              {person.nationality ? (
                <>
                  <dt className="eyebrow pt-0.5">Nationality</dt>
                  <dd className="text-[13.5px] text-ink">{person.nationality}</dd>
                </>
              ) : null}

              {person.originPlace ? (
                <>
                  <dt className="eyebrow pt-0.5">From</dt>
                  <dd className="text-[13.5px] text-ink">
                    {person.originPlace.name}
                    {person.originPlace.country ? `, ${person.originPlace.country}` : ''}
                  </dd>
                </>
              ) : null}
            </dl>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <CategoryLinks categories={person.categories} />
              <ShareButton title={person.fullName} />
            </div>

            {person.summary ? (
              <p className="mt-7 max-w-[58ch] text-lede leading-relaxed text-ink">
                {person.summary}
              </p>
            ) : null}
          </div>
        </header>

        {/* -------------------------------------------------- why it matters */}
        {person.whyItMatters ? (
          <section className="border-b border-rule py-12">
            <div className="grid gap-8 lg:grid-cols-[minmax(0,14rem)_minmax(0,1fr)] lg:gap-16">
              <h2 className="eyebrow pt-1">Why this person matters</h2>
              <blockquote className="max-w-[62ch] border-l-2 border-accent pl-6 font-display text-[1.375rem] leading-[1.45] text-ink">
                {person.whyItMatters}
              </blockquote>
            </div>
          </section>
        ) : null}

        {/* --------------------------------------------------------- body */}
        <div className="grid gap-12 py-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,15rem)] lg:gap-16">
          <div className="min-w-0">
            {sections.map((section, index) => (
              <section key={section.id} id={section.id} className="scroll-mt-24">
                <SectionHeading
                  index={String(index + 1).padStart(2, '0')}
                  title={section.title}
                  className="mb-6"
                />
                <Prose markdown={section.body} />
              </section>
            ))}

            {sections.length === 0 ? (
              <EmptyState
                title="This profile has no long-form text yet"
                description="The editorial desk is still preparing this entry."
              />
            ) : null}

            {/* ------------------------------------------- timeline */}
            {person.timeline.length > 0 ? (
              <section id="timeline" className="mt-14 scroll-mt-24">
                <SectionHeading title="Life and career" className="mb-6" />
                <Timeline events={person.timeline} />
              </section>
            ) : null}

            {/* ------------------------------------------- sources */}
            <section id="sources" className="mt-14 scroll-mt-24">
              <SectionHeading title="Sources and further reading" className="mb-6" />
              <p className="mb-5 max-w-[62ch] text-small text-ink-muted">
                Every factual claim in this profile is tied to a source. Links marked
                &ldquo;not yet checked&rdquo; are queued for verification by the editorial
                desk.
              </p>
              <SourceList sources={person.sources} />
            </section>

            {/* ------------------------------------------- related */}
            <section id="related" className="mt-14 scroll-mt-24">
              <SectionHeading title="Related people" className="mb-6" />
              {person.related.length > 0 ? (
                <RelatedPeople people={person.related} />
              ) : similar.length > 0 ? (
                <ul className="grid gap-5 sm:grid-cols-2">
                  {similar.map((other) => (
                    <li key={other.id}>
                      <Link
                        href={`/people/${other.slug}`}
                        className="group flex gap-4 border-b border-rule pb-5"
                      >
                        <Portrait
                          media={other.portrait}
                          name={other.fullName}
                          className="size-20 shrink-0"
                          sizes="80px"
                          imageClassName="transition-transform duration-500 group-hover:scale-[1.04]"
                        />
                        <div>
                          <p className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-accent">
                            Same field
                          </p>
                          <h4 className="mt-1 font-display text-[1.0625rem] font-semibold text-ink group-hover:text-accent">
                            {other.fullName}
                          </h4>
                          <p className="mt-1 line-clamp-2 text-[13px] text-ink-muted">
                            {other.summary}
                          </p>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-small text-ink-faint">
                  No documented relationships have been recorded for this profile yet.
                </p>
              )}
            </section>
          </div>

          {/* ------------------------------------------------- side rail */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 space-y-8">
              {biography.toc.length > 1 ? (
                <nav aria-label="On this page">
                  <p className="eyebrow">On this page</p>
                  <ol className="mt-3 space-y-2 border-l border-rule pl-4">
                    {biography.toc.map((entry) => (
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

              {person.tags.length > 0 ? (
                <div>
                  <p className="eyebrow">Tags</p>
                  <TagList tags={person.tags} className="mt-3" />
                </div>
              ) : null}

              {person.collections.length > 0 ? (
                <div>
                  <p className="eyebrow">Appears in</p>
                  <ul className="mt-3 space-y-1.5">
                    {person.collections.map((collection) => (
                      <li key={collection.slug}>
                        <Link
                          href={`/collections/${collection.slug}`}
                          className="text-[12.5px] text-ink-muted transition-colors hover:text-accent"
                        >
                          {collection.title}
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

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd(person)) }}
      />
    </>
  );
}

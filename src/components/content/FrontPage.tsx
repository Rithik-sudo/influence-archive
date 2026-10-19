import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Portrait } from './Portrait';
import { formatLifespanCompact } from '@/lib/format';
import type { PersonSummary } from '@/server/queries/people';

/**
 * The front page's lead figure: a dominant portrait beside the masthead.
 * Deliberately not a card — the image is presented as a plate.
 */
export function HeroFigure({ person }: { person: PersonSummary | null }) {
  if (!person) {
    return (
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-surface-sunken">
        <span
          aria-hidden
          className="absolute inset-0 grid place-items-center font-display text-6xl font-semibold text-sage-deep/30"
        >
          IA
        </span>
      </div>
    );
  }

  return (
    <figure className="group">
      <Link href={`/people/${person.slug}`} className="block">
        <Portrait
          media={person.portrait}
          name={person.fullName}
          priority
          sizes="(max-width: 768px) 70vw, 30vw"
          className="aspect-[4/5] w-full"
          imageClassName="transition-transform duration-700 ease-out group-hover:scale-[1.02]"
        />
      </Link>
      <figcaption className="mt-3 border-t border-rule pt-2.5">
        <p className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-accent">
          Plate 01
        </p>
        <p className="mt-1 font-display text-[1.0625rem] font-semibold leading-snug text-ink">
          <Link href={`/people/${person.slug}`} className="hover:text-accent">
            {person.fullName}
          </Link>
        </p>
        <p className="mt-0.5 font-mono text-[11px] text-ink-faint">
          {formatLifespanCompact(
            { date: person.birthDate, precision: person.birthPrecision },
            { date: person.deathDate, precision: person.deathPrecision },
            person.isLiving,
          )}
          {person.occupations[0] ? ` · ${person.occupations[0]}` : ''}
        </p>
      </figcaption>
    </figure>
  );
}

export function FeaturedFigure({
  person,
  rank,
}: {
  person: PersonSummary;
  rank: string;
}) {
  return (
    <article className="group">
      <Link href={`/people/${person.slug}`} className="block">
        <Portrait
          media={person.portrait}
          name={person.fullName}
          sizes="(max-width: 768px) 100vw, 45vw"
          className="aspect-[16/11] w-full"
          imageClassName="transition-transform duration-500 ease-out group-hover:scale-[1.03]"
        />
        <div className="mt-4 border-t border-rule pt-3">
          <p className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-accent">
            {rank}
          </p>
          <h3 className="mt-1.5 font-display text-headline font-semibold leading-tight text-ink transition-colors group-hover:text-accent">
            {person.fullName}
          </h3>
          <p className="mt-1.5 font-mono text-[11px] text-ink-faint">
            {formatLifespanCompact(
              { date: person.birthDate, precision: person.birthPrecision },
              { date: person.deathDate, precision: person.deathPrecision },
              person.isLiving,
            )}
            {person.nationality ? ` · ${person.nationality}` : ''}
          </p>
          <p className="mt-3 line-clamp-4 text-small leading-relaxed text-ink-muted">
            {person.summary}
          </p>
          {person.occupations.length > 0 ? (
            <p className="mt-3 text-[13px] italic text-ink-faint">
              {person.occupations.slice(0, 3).join(' · ')}
            </p>
          ) : null}
        </div>
      </Link>
    </article>
  );
}

export function TextLink({
  href,
  children,
  className,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={`group inline-flex items-center gap-1.5 text-small text-ink-muted transition-colors hover:text-accent ${className ?? ''}`}
    >
      {children}
      <ArrowRight
        aria-hidden
        className="size-3.5 transition-transform group-hover:translate-x-0.5"
        strokeWidth={1.75}
      />
    </Link>
  );
}

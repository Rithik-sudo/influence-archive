import Link from 'next/link';
import { cn } from '@/lib/cn';
import { Portrait } from './Portrait';
import { formatLifespanCompact } from '@/lib/format';
import type { PersonSummary } from '@/server/queries/people';

export function PersonCard({
  person,
  className,
  showSummary = true,
  priority = false,
}: {
  person: PersonSummary;
  className?: string;
  showSummary?: boolean;
  priority?: boolean;
}) {
  const lifespan = formatLifespanCompact(
    { date: person.birthDate, precision: person.birthPrecision },
    { date: person.deathDate, precision: person.deathPrecision },
    person.isLiving,
  );

  return (
    <article className={cn('group', className)}>
      <Link href={`/people/${person.slug}`} className="block">
        <Portrait
          media={person.portrait}
          name={person.fullName}
          priority={priority}
          sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 22vw"
          className="aspect-[4/5] w-full"
          imageClassName="transition-transform duration-500 ease-out group-hover:scale-[1.03]"
        />
        <div className="mt-3">
          <h3 className="font-display text-[1.0625rem] font-semibold leading-snug text-ink transition-colors group-hover:text-accent">
            {person.fullName}
          </h3>
          <p className="mt-0.5 font-mono text-[11px] text-ink-faint">
            {lifespan}
            {person.nationality ? ` · ${person.nationality}` : ''}
          </p>
          {showSummary && person.summary ? (
            <p className="mt-2 line-clamp-3 text-[13px] leading-relaxed text-ink-muted">
              {person.summary}
            </p>
          ) : null}
          {person.occupations.length > 0 ? (
            <p className="mt-2 text-[12px] italic text-ink-faint">
              {person.occupations.slice(0, 2).join(' · ')}
            </p>
          ) : null}
        </div>
      </Link>
    </article>
  );
}

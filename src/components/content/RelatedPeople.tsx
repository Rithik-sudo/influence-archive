import Link from 'next/link';
import { Portrait } from './Portrait';
import { relationshipLabel } from './Timeline';
import type { RelatedPerson } from '@/server/queries/people';

export function RelatedPeople({ people }: { people: RelatedPerson[] }) {
  if (people.length === 0) {
    return (
      <p className="text-small text-ink-faint">
        No documented relationships have been recorded for this profile yet.
      </p>
    );
  }

  return (
    <ul className="grid gap-5 sm:grid-cols-2">
      {people.map((person) => (
        <li key={`${person.slug}-${person.relationship}`}>
          <Link
            href={`/people/${person.slug}`}
            className="group flex gap-4 border-b border-rule pb-5 transition-colors"
          >
            <Portrait
              media={person.portrait}
              name={person.fullName}
              className="size-20 shrink-0"
              imageClassName="transition-transform duration-500 ease-out group-hover:scale-[1.04]"
              sizes="80px"
            />
            <div className="min-w-0">
              <p className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-accent">
                {relationshipLabel(person.relationship)}
              </p>
              <h4 className="mt-1 font-display text-[1.0625rem] font-semibold leading-snug text-ink transition-colors group-hover:text-accent">
                {person.fullName}
              </h4>
              {person.description ? (
                <p className="mt-1 line-clamp-3 text-[13px] leading-relaxed text-ink-muted">
                  {person.description}
                </p>
              ) : null}
              {person.periodNote ? (
                <p className="mt-1 text-[11.5px] italic text-ink-faint">{person.periodNote}</p>
              ) : null}
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}

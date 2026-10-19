import { formatDate } from '@/lib/format';
import type { TimelineEvent } from '@/server/queries/people';

const RELATIONSHIP_LABELS: Record<string, string> = {
  influenced: 'Influenced',
  influenced_by: 'Influenced by',
  collaborated_with: 'Collaborated with',
  mentored: 'Mentored',
  student_of: 'Student of',
  rival_of: 'Rival of',
  co_founded: 'Co-founded with',
  family: 'Family',
  contemporary: 'Contemporary of',
  movement: 'Shared movement',
};

export function Timeline({ events }: { events: TimelineEvent[] }) {
  if (events.length === 0) return null;

  return (
    <ol className="relative border-l border-rule pl-5 sm:pl-6">
      {events.map((event) => {
        const label = formatDate(event.startDate, event.startPrecision);
        const end = formatDate(event.endDate, event.endPrecision);

        return (
          <li key={event.id} className="relative pb-6 last:pb-0">
            <span
              aria-hidden
              className="absolute -left-[1.5625rem] top-[0.45rem] size-2 rounded-full border border-accent bg-paper sm:-left-[1.8125rem]"
            />
            <p className="font-mono text-[11px] tracking-[0.08em] text-accent">
              {label}
              {end ? ` – ${end}` : ''}
            </p>
            <h4 className="mt-1 font-sans text-[0.9375rem] font-semibold text-ink">
              {event.title}
            </h4>
            {event.description ? (
              <p className="mt-1 text-[13.5px] leading-relaxed text-ink-muted">{event.description}</p>
            ) : null}
            <p className="mt-1.5 text-[11.5px] text-ink-faint">
              {event.placeName ? `${event.placeName}` : null}
              {event.placeName && event.sourceTitle ? ' · ' : ''}
              {event.sourceTitle ? (
                event.sourceUrl ? (
                  <a
                    href={event.sourceUrl}
                    rel="noreferrer noopener"
                    target="_blank"
                    className="underline underline-offset-2 hover:text-accent"
                  >
                    {event.sourceTitle}
                  </a>
                ) : (
                  event.sourceTitle
                )
              ) : null}
            </p>
          </li>
        );
      })}
    </ol>
  );
}

export function relationshipLabel(type: string): string {
  return RELATIONSHIP_LABELS[type] ?? type.replace(/_/g, ' ');
}

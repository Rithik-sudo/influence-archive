import type { SourceRef } from '@/server/queries/people';

const TYPE_LABELS: Record<string, string> = {
  book: 'Book',
  journal_article: 'Journal article',
  primary_document: 'Primary document',
  archive: 'Archive',
  website: 'Web',
  newspaper: 'Newspaper',
  biography: 'Biography',
  film: 'Film',
  other: 'Other',
};

export function SourceList({
  sources,
  showVerification = true,
}: {
  sources: SourceRef[];
  showVerification?: boolean;
}) {
  if (sources.length === 0) {
    return (
      <p className="text-small text-ink-faint">
        No sources have been attached to this profile yet.
      </p>
    );
  }

  return (
    <ol className="space-y-3">
      {sources.map((source, index) => (
        <li key={source.id} id={`source-${index + 1}`} className="scroll-mt-24">
          <div className="flex gap-3">
            <span className="mt-0.5 shrink-0 font-mono text-[11px] text-accent">
              [{index + 1}]
            </span>
            <div className="min-w-0">
              <p className="text-[13.5px] leading-snug text-ink">
                {source.url ? (
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="underline decoration-rule-strong underline-offset-2 transition-colors hover:text-accent hover:decoration-accent"
                  >
                    {source.title}
                  </a>
                ) : (
                  source.title
                )}
              </p>
              <p className="mt-0.5 text-[12px] text-ink-faint">
                {[source.author, source.publisher, source.publishedDate]
                  .filter(Boolean)
                  .join(' · ')}
                {source.type ? ` · ${TYPE_LABELS[source.type] ?? source.type}` : ''}
                {source.locator ? ` · ${source.locator}` : ''}
              </p>
              {showVerification && source.verificationStatus !== 'checked' ? (
                <p className="mt-0.5 font-mono text-[10.5px] uppercase tracking-[0.1em] text-ink-faint">
                  Link not yet checked
                </p>
              ) : null}
            </div>
          </div>
        </li>
      ))}
    </ol>
  );
}

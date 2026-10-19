import type { Metadata } from 'next';
import { getEditorIdentity } from '@/server/auth/session';
import { listAdminSources } from '@/server/queries/adminLists';
import { deleteSourceAction, saveSourceAction } from '@/server/actions/content';
import { ActionForm } from '@/components/admin/ActionForm';
import { Field, Select, TextArea, TextInput } from '@/components/admin/Fields';
import { StatusPill } from '@/components/admin/StatusPill';
import { EmptyState } from '@/components/ui/States';
import { formatPublishedDate } from '@/lib/format';

export const metadata: Metadata = { title: 'Sources' };
export const dynamic = 'force-dynamic';

const TYPES = [
  { value: 'book', label: 'Book' },
  { value: 'journal_article', label: 'Journal article' },
  { value: 'primary_document', label: 'Primary document' },
  { value: 'archive', label: 'Archive' },
  { value: 'website', label: 'Web' },
  { value: 'newspaper', label: 'Newspaper' },
  { value: 'biography', label: 'Biography' },
  { value: 'film', label: 'Film' },
  { value: 'other', label: 'Other' },
];

export default async function AdminSourcesPage() {
  const identity = await getEditorIdentity();
  const sources = await listAdminSources(identity);

  return (
    <div>
      <header className="border-b border-rule pb-6">
        <p className="eyebrow">Editorial</p>
        <h1 className="mt-2 font-display text-[1.75rem] font-semibold text-ink">Sources</h1>
        <p className="mt-1.5 text-small text-ink-muted">
          Every factual claim is tied to one of these. Run{' '}
          <code className="font-mono text-[12.5px] text-ink">npm run db:verify</code> to re-check
          the links.
        </p>
      </header>

      <details className="mt-8 rounded-[var(--radius-md)] border border-rule bg-surface p-4">
        <summary className="cursor-pointer text-small font-medium text-ink">Add a source</summary>
        <ActionForm action={saveSourceAction} className="mt-4 space-y-4" submitLabel="Create source">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Title" name="title" required>
              <TextInput name="title" required />
            </Field>
            <Field label="Key" name="key" required hint="A stable identifier, e.g. lovelace-1934.">
              <TextInput name="key" required placeholder="lovelace-1934" />
            </Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Author or organisation" name="author">
              <TextInput name="author" />
            </Field>
            <Field label="Publisher" name="publisher">
              <TextInput name="publisher" />
            </Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="URL" name="url">
              <TextInput name="url" placeholder="https://" />
            </Field>
            <Field label="Published" name="publishedDate">
              <TextInput name="publishedDate" placeholder="1843" />
            </Field>
            <Field label="Type" name="type">
              <Select name="type" defaultValue="other" options={TYPES} />
            </Field>
          </div>
          <Field label="Notes" name="notes">
            <TextArea name="notes" rows={2} />
          </Field>
        </ActionForm>
      </details>

      {sources.length === 0 ? (
        <EmptyState className="mt-8" title="No sources yet" description="Add the first one above." />
      ) : (
        <ul className="mt-8 divide-y divide-[var(--rule)] border-t border-rule">
          {sources.map((source) => (
            <li key={source.id} className="py-3">
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <StatusPill status={source.verificationStatus} />
                <span className="min-w-0 flex-1 truncate text-[13.5px] text-ink">
                  {source.url ? (
                    <a href={source.url} target="_blank" rel="noreferrer noopener" className="hover:text-accent">
                      {source.title}
                    </a>
                  ) : (
                    source.title
                  )}
                </span>
                <span className="font-mono text-[11px] text-ink-faint">{source.key}</span>
                <span className="font-mono text-[11px] text-ink-faint">
                  {source.usedBy} uses
                </span>
              </div>
              <p className="mt-0.5 font-mono text-[11px] text-ink-faint">
                {[source.author, source.publisher, source.publishedDate].filter(Boolean).join(' · ')}
                {source.verifiedAt ? ` · checked ${formatPublishedDate(source.verifiedAt)}` : ''}
              </p>
              <details className="mt-2">
                <summary className="cursor-pointer text-[12.5px] text-ink-muted hover:text-ink">
                  Edit
                </summary>
                <ActionForm
                  action={saveSourceAction}
                  className="mt-3 space-y-3"
                  hiddenFields={{ id: source.id }}
                  submitLabel="Save source"
                >
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Field label="Title" name="title" required>
                      <TextInput name="title" defaultValue={source.title} required />
                    </Field>
                    <Field label="Key" name="key" required>
                      <TextInput name="key" defaultValue={source.key} required />
                    </Field>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-3">
                    <Field label="Author" name="author">
                      <TextInput name="author" defaultValue={source.author ?? ''} />
                    </Field>
                    <Field label="Publisher" name="publisher">
                      <TextInput name="publisher" defaultValue={source.publisher ?? ''} />
                    </Field>
                    <Field label="Published" name="publishedDate">
                      <TextInput name="publishedDate" defaultValue={source.publishedDate ?? ''} />
                    </Field>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Field label="URL" name="url">
                      <TextInput name="url" defaultValue={source.url ?? ''} />
                    </Field>
                    <Field label="Type" name="type">
                      <Select name="type" defaultValue={source.type} options={TYPES} />
                    </Field>
                  </div>
                  <Field label="Notes" name="notes">
                    <TextArea name="notes" defaultValue={source.notes} rows={2} />
                  </Field>
                </ActionForm>
                <ActionForm
                  action={deleteSourceAction}
                  className="mt-3"
                  hiddenFields={{ id: source.id }}
                  requireConfirmation
                  confirmLabel="Delete source"
                  submitLabel="Delete this source"
                />
              </details>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

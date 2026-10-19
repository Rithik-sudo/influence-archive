import type { Metadata } from 'next';
import Link from 'next/link';
import { getEditorIdentity } from '@/server/auth/session';
import { listCollections } from '@/server/queries/collections';
import { deleteCollectionAction, saveCollectionAction } from '@/server/actions/content';
import { ActionForm } from '@/components/admin/ActionForm';
import { Checkbox, Field, Select, TextArea, TextInput } from '@/components/admin/Fields';
import { StatusPill } from '@/components/admin/StatusPill';
import { EmptyState } from '@/components/ui/States';

export const metadata: Metadata = { title: 'Collections' };
export const dynamic = 'force-dynamic';

const STATUSES = [
  { value: 'published', label: 'Published' },
  { value: 'draft', label: 'Draft' },
  { value: 'in_review', label: 'In review' },
  { value: 'archived', label: 'Archived' },
];

export default async function AdminCollectionsPage() {
  const identity = await getEditorIdentity();
  const collections = await listCollections(identity);

  return (
    <div>
      <header className="border-b border-rule pb-6">
        <p className="eyebrow">Editorial</p>
        <h1 className="mt-2 font-display text-[1.75rem] font-semibold text-ink">Collections</h1>
        <p className="mt-1.5 text-small text-ink-muted">
          Manually curated groupings. Members can be reordered from the editor.
        </p>
      </header>

      {collections.length === 0 ? (
        <EmptyState className="mt-8" title="No collections yet" description="Create the first one." />
      ) : (
        <ul className="mt-8 space-y-4">
          {collections.map((collection) => (
            <li key={collection.id} className="rounded-[var(--radius-md)] border border-rule bg-surface p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="font-display text-[1.0625rem] font-semibold text-ink">
                    <Link href={`/admin/collections/${collection.id}`} className="hover:text-accent">
                      {collection.title}
                    </Link>
                  </h2>
                  <p className="mt-1 max-w-[62ch] text-[13px] text-ink-muted">
                    {collection.description}
                  </p>
                  <p className="mt-2 flex items-center gap-3 font-mono text-[11px] text-ink-faint">
                    <span>{collection.slug}</span>
                    <span>{collection.itemCount} entries</span>
                    <StatusPill status={collection.featured ? 'published' : 'draft'} />
                  </p>
                </div>
              </div>

              <details className="mt-4">
                <summary className="cursor-pointer text-[13px] text-ink-muted hover:text-ink">
                  Edit
                </summary>
                <ActionForm
                  action={saveCollectionAction}
                  className="mt-4 space-y-4"
                  hiddenFields={{ id: collection.id }}
                  submitLabel="Save collection"
                >
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Title" name="title" required>
                      <TextInput name="title" defaultValue={collection.title} required />
                    </Field>
                    <Field label="Slug" name="slug" required>
                      <TextInput name="slug" defaultValue={collection.slug} required />
                    </Field>
                  </div>
                  <Field label="Description" name="description" required>
                    <TextArea name="description" defaultValue={collection.description} rows={2} required />
                  </Field>
                  <Field label="Introduction" name="introductionMd" hint="Markdown, shown above the members.">
                    <TextArea name="introductionMd" defaultValue="" rows={6} mono />
                  </Field>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Status" name="status">
                      <Select name="status" defaultValue="draft" options={STATUSES} />
                    </Field>
                    <Field label="SEO title" name="seoTitle">
                      <TextInput name="seoTitle" defaultValue={collection.title} />
                    </Field>
                  </div>
                  <Checkbox name="featured" defaultChecked={collection.featured} label="Featured" />
                </ActionForm>

                <ActionForm
                  action={deleteCollectionAction}
                  className="mt-4 border-t border-rule pt-4"
                  hiddenFields={{ id: collection.id }}
                  requireConfirmation
                  confirmLabel="Delete collection"
                  submitLabel="Delete this collection"
                />
              </details>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

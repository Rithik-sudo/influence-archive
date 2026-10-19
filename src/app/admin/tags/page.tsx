import type { Metadata } from 'next';
import { getEditorIdentity } from '@/server/auth/session';
import { listTags } from '@/server/queries/search';
import { deleteTagAction, saveTagAction } from '@/server/actions/taxonomy';
import { ActionForm } from '@/components/admin/ActionForm';
import { Field, TextArea, TextInput } from '@/components/admin/Fields';
import { EmptyState } from '@/components/ui/States';

export const metadata: Metadata = { title: 'Tags' };
export const dynamic = 'force-dynamic';

export default async function AdminTagsPage() {
  const identity = await getEditorIdentity();
  const tags = await listTags(identity);

  return (
    <div>
      <header className="border-b border-rule pb-6">
        <p className="eyebrow">Taxonomy</p>
        <h1 className="mt-2 font-display text-[1.75rem] font-semibold text-ink">Tags</h1>
        <p className="mt-1.5 text-small text-ink-muted">
          Finer-grained discovery than fields. Tags are shared, so keep them few and specific.
        </p>
      </header>

      <details className="mt-8 rounded-[var(--radius-md)] border border-rule bg-surface p-4">
        <summary className="cursor-pointer text-small font-medium text-ink">Add a tag</summary>
        <ActionForm action={saveTagAction} className="mt-4 space-y-4" submitLabel="Create tag">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Name" name="name" required>
              <TextInput name="name" required />
            </Field>
            <Field label="Slug" name="slug" required>
              <TextInput name="slug" required placeholder="quantum-physics" />
            </Field>
          </div>
          <Field label="Description" name="description">
            <TextArea name="description" rows={2} />
          </Field>
        </ActionForm>
      </details>

      {tags.length === 0 ? (
        <EmptyState className="mt-8" title="No tags yet" description="Add the first one above." />
      ) : (
        <ul className="mt-8 divide-y divide-[var(--rule)] border-t border-rule">
          {tags.map((tag) => (
            <li key={tag.slug} className="py-3">
              <div className="flex flex-wrap items-baseline gap-x-3">
                <span className="text-[13.5px] font-medium text-ink">{tag.name}</span>
                <span className="font-mono text-[11px] text-ink-faint">{tag.slug}</span>
                <span className="ml-auto font-mono text-[11px] text-ink-faint">
                  {tag.count} {tag.count === 1 ? 'profile' : 'profiles'}
                </span>
              </div>
              <details className="mt-2">
                <summary className="cursor-pointer text-[12.5px] text-ink-muted hover:text-ink">
                  Edit
                </summary>
                <ActionForm
                  action={saveTagAction}
                  className="mt-3 space-y-3"
                  hiddenFields={{ id: (tag as { id?: string }).id ?? '' }}
                  submitLabel="Save tag"
                >
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Field label="Name" name="name" required>
                      <TextInput name="name" defaultValue={tag.name} required />
                    </Field>
                    <Field label="Slug" name="slug" required>
                      <TextInput name="slug" defaultValue={tag.slug} required />
                    </Field>
                  </div>
                  <Field label="Description" name="description">
                    <TextArea name="description" defaultValue={tag.description} rows={2} />
                  </Field>
                </ActionForm>
                <ActionForm
                  action={deleteTagAction}
                  className="mt-3"
                  hiddenFields={{ id: (tag as { id?: string }).id ?? '' }}
                  requireConfirmation
                  confirmLabel="Delete tag"
                  submitLabel="Delete this tag"
                />
              </details>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

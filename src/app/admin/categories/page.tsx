import type { Metadata } from 'next';
import { getEditorIdentity } from '@/server/auth/session';
import { listCategories } from '@/server/queries/categories';
import { deleteCategoryAction, saveCategoryAction } from '@/server/actions/taxonomy';
import { ActionForm } from '@/components/admin/ActionForm';
import { Checkbox, Field, Select, TextArea, TextInput } from '@/components/admin/Fields';
import { StatusPill } from '@/components/admin/StatusPill';
import { EmptyState } from '@/components/ui/States';

export const metadata: Metadata = { title: 'Fields' };
export const dynamic = 'force-dynamic';

const STATUSES = [
  { value: 'published', label: 'Published' },
  { value: 'draft', label: 'Draft' },
  { value: 'in_review', label: 'In review' },
  { value: 'archived', label: 'Archived' },
];

export default async function AdminCategoriesPage() {
  const identity = await getEditorIdentity();
  const categories = await listCategories(identity);
  const parents = categories.filter((c) => !c.parentId);

  return (
    <div>
      <header className="border-b border-rule pb-6">
        <p className="eyebrow">Taxonomy</p>
        <h1 className="mt-2 font-display text-[1.75rem] font-semibold text-ink">Fields</h1>
        <p className="mt-1.5 text-small text-ink-muted">
          The primary routes into the archive. A person may sit under several fields.
        </p>
      </header>

      <details className="mt-8 rounded-[var(--radius-md)] border border-rule bg-surface p-4">
        <summary className="cursor-pointer text-small font-medium text-ink">Add a field</summary>
        <ActionForm action={saveCategoryAction} className="mt-4 space-y-4" submitLabel="Create field">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Name" name="name" required>
              <TextInput name="name" required />
            </Field>
            <Field label="Slug" name="slug" required>
              <TextInput name="slug" required placeholder="science-technology" />
            </Field>
          </div>
          <Field label="Description" name="description">
            <TextArea name="description" rows={2} />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Parent field" name="parentId">
              <Select
                name="parentId"
                placeholder="No parent"
                options={parents.map((c) => ({ value: c.id, label: c.name }))}
              />
            </Field>
            <Field label="Sort order" name="sortOrder">
              <TextInput name="sortOrder" type="number" defaultValue={50} />
            </Field>
          </div>
          <Checkbox name="featured" label="Feature on the front page" />
        </ActionForm>
      </details>

      {categories.length === 0 ? (
        <EmptyState className="mt-8" title="No fields yet" description="Add the first one above." />
      ) : (
        <ul className="mt-8 space-y-4">
          {categories.map((category) => (
            <li key={category.id} className="rounded-[var(--radius-md)] border border-rule bg-surface p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="font-display text-[1.0625rem] font-semibold text-ink">
                    {category.name}
                    {category.parentName ? (
                      <span className="ml-2 font-sans text-[12px] font-normal text-ink-faint">
                        under {category.parentName}
                      </span>
                    ) : null}
                  </h2>
                  <p className="mt-1 max-w-[62ch] text-[13px] text-ink-muted">
                    {category.description}
                  </p>
                  <p className="mt-2 flex items-center gap-3 font-mono text-[11px] text-ink-faint">
                    <span>{category.slug}</span>
                    <span>{category.personCount} profiles</span>
                    <StatusPill status={category.status} />
                  </p>
                </div>
              </div>

              <details className="mt-4">
                <summary className="cursor-pointer text-[13px] text-ink-muted hover:text-ink">
                  Edit
                </summary>
                <ActionForm
                  action={saveCategoryAction}
                  className="mt-4 space-y-4"
                  hiddenFields={{ id: category.id }}
                  submitLabel="Save field"
                >
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Name" name="name" required>
                      <TextInput name="name" defaultValue={category.name} required />
                    </Field>
                    <Field label="Slug" name="slug" required>
                      <TextInput name="slug" defaultValue={category.slug} required />
                    </Field>
                  </div>
                  <Field label="Description" name="description">
                    <TextArea name="description" defaultValue={category.description} rows={2} />
                  </Field>
                  <div className="grid gap-4 sm:grid-cols-3">
                    <Field label="Parent field" name="parentId">
                      <Select
                        name="parentId"
                        defaultValue={category.parentId ?? ''}
                        placeholder="No parent"
                        options={parents
                          .filter((c) => c.id !== category.id)
                          .map((c) => ({ value: c.id, label: c.name }))}
                      />
                    </Field>
                    <Field label="Status" name="status">
                      <Select name="status" defaultValue={category.status} options={STATUSES} />
                    </Field>
                    <Field label="Sort order" name="sortOrder">
                      <TextInput name="sortOrder" type="number" defaultValue={category.sortOrder} />
                    </Field>
                  </div>
                  <Checkbox name="featured" defaultChecked={category.featured} label="Featured" />
                </ActionForm>

                <ActionForm
                  action={deleteCategoryAction}
                  className="mt-4 border-t border-rule pt-4"
                  hiddenFields={{ id: category.id }}
                  requireConfirmation
                  confirmLabel="Delete field"
                  submitLabel="Delete this field"
                />
              </details>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getEditorIdentity } from '@/server/auth/session';
import { getCollectionForAdmin } from '@/server/queries/collections';
import { listPeopleForPickers } from '@/server/queries/people';
import { listAdminArticles } from '@/server/queries/adminLists';
import { deleteCollectionAction, saveCollectionAction } from '@/server/actions/content';
import { ActionForm } from '@/components/admin/ActionForm';
import { Checkbox, CheckboxList, Field, Select, TextArea, TextInput } from '@/components/admin/Fields';
import { StatusPill } from '@/components/admin/StatusPill';

export const metadata: Metadata = { title: 'Edit collection' };
export const dynamic = 'force-dynamic';

type Params = { params: Promise<{ id: string }> };

const STATUSES = [
  { value: 'published', label: 'Published' },
  { value: 'draft', label: 'Draft' },
  { value: 'in_review', label: 'In review' },
  { value: 'archived', label: 'Archived' },
];

export default async function AdminCollectionPage({ params }: Params) {
  const { id } = await params;
  const identity = await getEditorIdentity();

  const isNew = id === 'new';
  const collection = isNew ? null : await getCollectionForAdmin(id, identity);
  if (!isNew && !collection) notFound();

  const [people, articles] = await Promise.all([
    listPeopleForPickers(identity),
    listAdminArticles(identity),
  ]);

  return (
    <div>
      <header className="flex flex-wrap items-end justify-between gap-4 border-b border-rule pb-6">
        <div>
          <p className="eyebrow">{isNew ? 'New collection' : 'Editing'}</p>
          <h1 className="mt-2 font-display text-[1.75rem] font-semibold text-ink">
            {collection ? collection.title : 'Untitled collection'}
          </h1>
          {collection ? (
            <p className="mt-1.5 flex items-center gap-2 text-small text-ink-muted">
              <StatusPill status={collection.status} />
              {collection.slug}
            </p>
          ) : null}
        </div>
        {collection ? (
          <div className="flex gap-3">
            <Link
              href={`/collections/${collection.slug}`}
              className="inline-flex h-9 items-center rounded-[var(--radius-md)] border border-rule px-3.5 text-[13px] text-ink transition-colors hover:border-accent hover:text-accent"
            >
              Preview
            </Link>
            <Link
              href="/admin/collections"
              className="inline-flex h-9 items-center rounded-[var(--radius-md)] border border-rule px-3.5 text-[13px] text-ink-muted transition-colors hover:text-ink"
            >
              Back
            </Link>
          </div>
        ) : null}
      </header>

      <ActionForm
        action={saveCollectionAction}
        className="mt-8 space-y-10"
        hiddenFields={collection ? { id: collection.id } : undefined}
        submitLabel="Save collection"
      >
        <section className="space-y-5">
          <h2 className="eyebrow border-t border-rule pt-4">The collection</h2>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Title" name="title" required>
              <TextInput name="title" defaultValue={collection?.title} required />
            </Field>
            <Field label="Slug" name="slug" required>
              <TextInput name="slug" defaultValue={collection?.slug} required />
            </Field>
          </div>
          <Field label="Description" name="description" required>
            <TextArea name="description" defaultValue={collection?.description} rows={2} required />
          </Field>
          <Field
            label="Introduction"
            name="introductionMd"
            hint="Markdown, shown above the members."
          >
            <TextArea
              name="introductionMd"
              defaultValue={collection?.introductionMd ?? ''}
              rows={10}
              mono
            />
          </Field>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Status" name="status">
              <Select
                name="status"
                defaultValue={collection?.status ?? 'draft'}
                options={STATUSES}
              />
            </Field>
            <Field label="SEO title" name="seoTitle">
              <TextInput name="seoTitle" defaultValue={collection?.seoTitle ?? ''} />
            </Field>
          </div>
          <Checkbox name="featured" defaultChecked={collection?.featured} label="Featured" />
        </section>

        <section className="space-y-5">
          <h2 className="eyebrow border-t border-rule pt-4">Members</h2>
          <p className="-mt-2 text-[12.5px] text-ink-faint">
            People appear first, in the order selected, then essays.
          </p>
          <Field label="People" name="personIds">
            <CheckboxList
              name="personIds"
              defaultValues={collection?.personIds ?? []}
              options={people.map((p) => ({ value: p.id, label: p.fullName }))}
              columns={3}
            />
          </Field>
          <Field label="Essays" name="articleIds">
            <CheckboxList
              name="articleIds"
              defaultValues={collection?.articleIds ?? []}
              options={articles.map((a) => ({ value: a.id, label: a.title }))}
              columns={2}
            />
          </Field>
        </section>
      </ActionForm>

      {collection ? (
        <section className="mt-12">
          <h2 className="eyebrow border-t border-rule pt-4">Delete</h2>
          <ActionForm
            action={deleteCollectionAction}
            className="mt-4"
            hiddenFields={{ id: collection.id }}
            requireConfirmation
            confirmLabel="Delete collection"
            submitLabel="Delete this collection"
          />
        </section>
      ) : null}
    </div>
  );
}

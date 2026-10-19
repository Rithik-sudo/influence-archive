import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getEditorIdentity } from '@/server/auth/session';
import { getArticleForAdmin, listAdminArticles, listAdminMedia } from '@/server/queries/adminLists';
import { listCategories } from '@/server/queries/categories';
import { listTags, listAllSources } from '@/server/queries/search';
import { listPeopleForPickers } from '@/server/queries/people';
import { deleteArticleAction, saveArticleAction } from '@/server/actions/content';
import { ActionForm } from '@/components/admin/ActionForm';
import { CheckboxList, Field, Select, TextArea, TextInput } from '@/components/admin/Fields';
import { StatusPill } from '@/components/admin/StatusPill';

export const metadata: Metadata = { title: 'Edit essay' };
export const dynamic = 'force-dynamic';

type Params = { params: Promise<{ id: string }> };

const STATUSES = [
  { value: 'draft', label: 'Draft' },
  { value: 'in_review', label: 'In review' },
  { value: 'published', label: 'Published' },
  { value: 'archived', label: 'Archived' },
];

export default async function AdminArticlePage({ params }: Params) {
  const { id } = await params;
  const identity = await getEditorIdentity();

  const isNew = id === 'new';
  const article = isNew ? null : await getArticleForAdmin(id, identity);
  if (!isNew && !article) notFound();

  const [categories, tags, sources, people, media, allArticles] = await Promise.all([
    listCategories(identity),
    listTags(identity),
    listAllSources(identity),
    listPeopleForPickers(identity),
    listAdminMedia(identity),
    listAdminArticles(identity),
  ]);

  return (
    <div>
      <header className="flex flex-wrap items-end justify-between gap-4 border-b border-rule pb-6">
        <div>
          <p className="eyebrow">{isNew ? 'New essay' : 'Editing'}</p>
          <h1 className="mt-2 font-display text-[1.75rem] font-semibold text-ink">
            {article ? article.title : 'Untitled essay'}
          </h1>
          {article ? (
            <p className="mt-1.5 flex items-center gap-2 text-small text-ink-muted">
              <StatusPill status={article.status} />
              {article.slug}
            </p>
          ) : null}
        </div>
        {article ? (
          <Link
            href={`/articles/${article.slug}`}
            className="inline-flex h-9 items-center rounded-[var(--radius-md)] border border-rule px-3.5 text-[13px] text-ink transition-colors hover:border-accent hover:text-accent"
          >
            Preview
          </Link>
        ) : null}
      </header>

      <ActionForm
        action={saveArticleAction}
        className="mt-8 space-y-10"
        hiddenFields={article ? { id: article.id } : undefined}
        submitLabel="Save essay"
      >
        <section className="space-y-5">
          <h2 className="eyebrow border-t border-rule pt-4">The essay</h2>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Title" name="title" required>
              <TextInput name="title" defaultValue={article?.title} required />
            </Field>
            <Field label="Slug" name="slug" required>
              <TextInput name="slug" defaultValue={article?.slug} required />
            </Field>
          </div>
          <Field label="Summary" name="summary" required hint="One or two sentences.">
            <TextArea name="summary" defaultValue={article?.summary} rows={3} required />
          </Field>
          <Field
            label="Body"
            name="contentMd"
            hint="Markdown. Sub-headings with ##, quotations with >, callouts with :::note."
          >
            <TextArea name="contentMd" defaultValue={article?.contentMd} rows={24} mono />
          </Field>
        </section>

        <section className="space-y-5">
          <h2 className="eyebrow border-t border-rule pt-4">Publication</h2>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Status" name="status">
              <Select name="status" defaultValue={article?.status ?? 'draft'} options={STATUSES} />
            </Field>
            <Field label="Hero image" name="heroMediaId">
              <Select
                name="heroMediaId"
                defaultValue={article?.heroMediaId ?? ''}
                placeholder="No hero image"
                options={media.map((m) => ({ value: m.id, label: m.path }))}
              />
            </Field>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="SEO title" name="seoTitle">
              <TextInput name="seoTitle" defaultValue={article?.seoTitle ?? ''} />
            </Field>
            <Field label="SEO description" name="seoDescription">
              <TextInput name="seoDescription" defaultValue={article?.seoDescription ?? ''} />
            </Field>
          </div>
        </section>

        <section className="space-y-5">
          <h2 className="eyebrow border-t border-rule pt-4">Classification</h2>
          <Field label="Fields" name="categories">
            <CheckboxList
              name="categories"
              options={categories.map((c) => ({ value: c.slug, label: c.name }))}
              columns={3}
            />
          </Field>
          <Field label="Tags" name="tags">
            <CheckboxList
              name="tags"
              options={tags.map((t) => ({ value: t.slug, label: t.name }))}
              columns={3}
            />
          </Field>
          <Field label="People mentioned" name="personIds">
            <CheckboxList
              name="personIds"
              options={people.map((p) => ({ value: p.id, label: p.fullName }))}
              columns={3}
            />
          </Field>
          <Field label="Related essays" name="relatedArticleIds">
            <CheckboxList
              name="relatedArticleIds"
              options={allArticles
                .filter((a) => a.id !== article?.id)
                .map((a) => ({ value: a.id, label: a.title }))}
              columns={2}
            />
          </Field>
          <Field label="Sources" name="sourceIds">
            <CheckboxList
              name="sourceIds"
              options={sources.map((s) => ({ value: s.id, label: s.title }))}
              columns={2}
            />
          </Field>
        </section>
      </ActionForm>

      {article ? (
        <section className="mt-12">
          <h2 className="eyebrow border-t border-rule pt-4">Delete</h2>
          <p className="mt-3 max-w-[60ch] text-small text-ink-muted">
            Deleting an essay removes it and its links. Archiving keeps the record and hides it from
            readers, which is usually the safer choice.
          </p>
          <ActionForm
            action={deleteArticleAction}
            className="mt-4"
            hiddenFields={{ id: article.id }}
            requireConfirmation
            confirmLabel="Delete essay"
            submitLabel="Delete this essay"
          />
        </section>
      ) : null}
    </div>
  );
}

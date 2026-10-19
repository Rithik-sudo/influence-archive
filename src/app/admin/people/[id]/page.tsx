import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPersonForAdmin, listPeopleForPickers } from '@/server/queries/people';
import { listCategories } from '@/server/queries/categories';
import { listTags } from '@/server/queries/search';
import { listAllSources } from '@/server/queries/search';
import { getEditorIdentity } from '@/server/auth/session';
import {
  addRelationshipAction,
  addTimelineEventAction,
  attachSourceAction,
  deletePersonAction,
  deleteTimelineEventAction,
  detachSourceAction,
  savePersonAction,
} from '@/server/actions/people';
import { ActionForm } from '@/components/admin/ActionForm';
import { Checkbox, CheckboxList, Field, Select, TextArea, TextInput } from '@/components/admin/Fields';
import { StatusPill } from '@/components/admin/StatusPill';
import { EmptyState } from '@/components/ui/States';
import { formatDate, formatLifespan } from '@/lib/format';

export const metadata: Metadata = { title: 'Edit profile' };
export const dynamic = 'force-dynamic';

type Params = { params: Promise<{ id: string }> };

const PRECISIONS = [
  { value: 'day', label: 'Day' },
  { value: 'month', label: 'Month' },
  { value: 'year', label: 'Year' },
  { value: 'circa', label: 'Circa' },
  { value: 'unknown', label: 'Unknown' },
];

const STATUSES = [
  { value: 'draft', label: 'Draft' },
  { value: 'in_review', label: 'In review' },
  { value: 'published', label: 'Published' },
  { value: 'archived', label: 'Archived' },
];

const RELATIONSHIP_TYPES = [
  { value: 'influenced', label: 'Influenced' },
  { value: 'influenced_by', label: 'Influenced by' },
  { value: 'collaborated_with', label: 'Collaborated with' },
  { value: 'mentored', label: 'Mentored' },
  { value: 'student_of', label: 'Student of' },
  { value: 'rival_of', label: 'Rival of' },
  { value: 'co_founded', label: 'Co-founded with' },
  { value: 'family', label: 'Family' },
  { value: 'contemporary', label: 'Contemporary of' },
  { value: 'movement', label: 'Shared movement' },
];

export default async function AdminPersonPage({ params }: Params) {
  const { id } = await params;
  const identity = await getEditorIdentity();

  const isNew = id === 'new';
  const person = isNew ? null : await getPersonForAdmin(id, identity);
  if (!isNew && !person) notFound();

  const [categories, tags, sources, everyone] = await Promise.all([
    listCategories(identity),
    listTags(identity),
    listAllSources(identity),
    listPeopleForPickers(identity),
  ]);

  const mediaOptions = await (async () => {
    const { withDb } = await import('@/server/db/tx');
    const { mediaAssets } = await import('@/server/db/schema');
    return withDb(
      async (tx) =>
        tx
          .select({ id: mediaAssets.id, path: mediaAssets.path, altText: mediaAssets.altText })
          .from(mediaAssets)
          .orderBy(mediaAssets.path),
      identity,
    );
  })();

  return (
    <div>
      <header className="flex flex-wrap items-end justify-between gap-4 border-b border-rule pb-6">
        <div>
          <p className="eyebrow">{isNew ? 'New profile' : 'Editing'}</p>
          <h1 className="mt-2 font-display text-[1.75rem] font-semibold text-ink">
            {person ? person.fullName : 'Untitled profile'}
          </h1>
          {person ? (
            <p className="mt-1.5 flex items-center gap-2 text-small text-ink-muted">
              <StatusPill status={person.status} />
              {formatLifespan(
                { date: person.birthDate, precision: person.birthPrecision },
                { date: person.deathDate, precision: person.deathPrecision },
                person.isLiving,
              )}
            </p>
          ) : null}
        </div>
        {person ? (
          <div className="flex gap-3">
            <Link
              href={`/people/${person.slug}`}
              className="inline-flex h-9 items-center rounded-[var(--radius-md)] border border-rule px-3.5 text-[13px] text-ink transition-colors hover:border-accent hover:text-accent"
            >
              Preview
            </Link>
            <Link
              href="/admin/people"
              className="inline-flex h-9 items-center rounded-[var(--radius-md)] border border-rule px-3.5 text-[13px] text-ink-muted transition-colors hover:text-ink"
            >
              Back to list
            </Link>
          </div>
        ) : null}
      </header>

      {/* ------------------------------------------------------- the form */}
      <ActionForm action={savePersonAction} className="mt-8 space-y-10" hiddenFields={person ? { id: person.id } : undefined}>
        <section className="space-y-5">
          <h2 className="eyebrow border-t border-rule pt-4">Identity</h2>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Full name" name="fullName" required>
              <TextInput name="fullName" defaultValue={person?.fullName} required />
            </Field>
            <Field
              label="Slug"
              name="slug"
              hint="Leave blank to generate it from the name. Changing a published slug breaks existing links."
            >
              <TextInput name="slug" defaultValue={person?.slug} placeholder="auto" />
            </Field>
          </div>

          <Field
            label="Alternate names"
            name="alternateNames"
            hint="Comma separated. Used by search and shown under the name."
          >
            <TextInput
              name="alternateNames"
              defaultValue={person?.alternateNames.join(', ')}
              placeholder="Augusta Ada King, Countess of Lovelace"
            />
          </Field>

          <Field label="Occupations" name="occupations" hint="Comma separated.">
            <TextInput
              name="occupations"
              defaultValue={person?.occupations.join(', ')}
              placeholder="Mathematician, Writer"
            />
          </Field>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Nationality" name="nationality">
              <TextInput name="nationality" defaultValue={person?.nationality} />
            </Field>
            <Field label="Place of origin" name="originPlaceName">
              <TextInput name="originPlaceName" defaultValue={person?.originPlace?.name} />
            </Field>
          </div>
        </section>

        <section className="space-y-5">
          <h2 className="eyebrow border-t border-rule pt-4">Dates</h2>
          <p className="-mt-2 text-[12.5px] text-ink-faint">
            Record the precision the sources support. &ldquo;Circa&rdquo; and &ldquo;unknown&rdquo;
            are honest answers.
          </p>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <Field label="Born" name="birthDate">
              <TextInput name="birthDate" defaultValue={person?.birthDate ?? ''} placeholder="1815-12-10" />
            </Field>
            <Field label="Birth precision" name="birthPrecision">
              <Select name="birthPrecision" defaultValue={person?.birthPrecision ?? 'unknown'} options={PRECISIONS} />
            </Field>
            <Field label="Died" name="deathDate">
              <TextInput name="deathDate" defaultValue={person?.deathDate ?? ''} placeholder="1852-11-27" />
            </Field>
            <Field label="Death precision" name="deathPrecision">
              <Select name="deathPrecision" defaultValue={person?.deathPrecision ?? 'unknown'} options={PRECISIONS} />
            </Field>
          </div>
          <Checkbox name="isLiving" defaultChecked={person?.isLiving} label="Living" />
        </section>

        <section className="space-y-5">
          <h2 className="eyebrow border-t border-rule pt-4">Summary and significance</h2>
          <Field
            label="Summary"
            name="summary"
            required
            hint="One or two sentences, used on cards and in search results."
          >
            <TextArea name="summary" defaultValue={person?.summary} rows={3} required />
          </Field>
          <Field
            label="Why this person matters"
            name="whyItMatters"
            hint="Shown prominently at the top of the profile."
          >
            <TextArea name="whyItMatters" defaultValue={person?.whyItMatters} rows={4} />
          </Field>
        </section>

        <section className="space-y-5">
          <h2 className="eyebrow border-t border-rule pt-4">Long-form text</h2>
          <p className="-mt-2 text-[12.5px] text-[12.5px] text-ink-faint">
            Markdown. Use <code className="font-mono">##</code> for sub-headings,{' '}
            <code className="font-mono">&gt; quote</code> for quotations, and{' '}
            <code className="font-mono">:::note &#123;&quot;Title&quot;&#125;</code> for a callout.
            Cite sources with <code className="font-mono">&#123;&#123;cite:ID&#125;&#125;</code>.
          </p>
          <Field label="Biography" name="biographyMd">
            <TextArea name="biographyMd" defaultValue={person?.biographyMd} rows={16} mono />
          </Field>
          <Field label="Contributions and major works" name="contributionsMd">
            <TextArea name="contributionsMd" defaultValue={person?.contributionsMd} rows={8} mono />
          </Field>
          <Field label="Ideas and beliefs" name="ideasMd">
            <TextArea name="ideasMd" defaultValue={person?.ideasMd} rows={8} mono />
          </Field>
          <Field
            label="Challenges, failures and controversies"
            name="controversiesMd"
            hint="Only where there is meaningful, sourced material."
          >
            <TextArea name="controversiesMd" defaultValue={person?.controversiesMd} rows={8} mono />
          </Field>
          <Field label="Legacy and modern relevance" name="legacyMd">
            <TextArea name="legacyMd" defaultValue={person?.legacyMd} rows={8} mono />
          </Field>
        </section>

        <section className="space-y-5">
          <h2 className="eyebrow border-t border-rule pt-4">Classification</h2>
          <Field label="Fields" name="categories">
            <CheckboxList
              name="categories"
              defaultValues={person?.categories.map((c) => c.slug) ?? []}
              options={categories.map((c) => ({ value: c.slug, label: c.name }))}
              columns={3}
            />
          </Field>
          <Field label="Tags" name="tags">
            <CheckboxList
              name="tags"
              defaultValues={person?.tags.map((t) => t.slug) ?? []}
              options={tags.map((t) => ({ value: t.slug, label: t.name }))}
              columns={3}
            />
          </Field>
        </section>

        <section className="space-y-5">
          <h2 className="eyebrow border-t border-rule pt-4">Publication</h2>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Status" name="status">
              <Select name="status" defaultValue={person?.status ?? 'draft'} options={STATUSES} />
            </Field>
            <Field label="Portrait" name="portraitMediaId" hint="Choose from the media library.">
              <Select
                name="portraitMediaId"
                defaultValue={person?.portrait?.path ? (mediaOptions.find((m) => m.path === person.portrait!.path)?.id ?? '') : ''}
                placeholder="No portrait"
                options={mediaOptions.map((m) => ({ value: m.id, label: m.path }))}
              />
            </Field>
          </div>
          <Checkbox name="featured" defaultChecked={person?.featured} label="Feature on the front page" />
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="SEO title" name="seoTitle">
              <TextInput name="seoTitle" defaultValue={person?.seoTitle ?? ''} />
            </Field>
            <Field label="SEO description" name="seoDescription">
              <TextInput name="seoDescription" defaultValue={person?.seoDescription ?? ''} />
            </Field>
          </div>
        </section>
      </ActionForm>

      {/* --------------------------------------------------- timeline */}
      {person ? (
        <section className="mt-12">
          <h2 className="eyebrow border-t border-rule pt-4">Timeline</h2>
          {person.timeline.length > 0 ? (
            <ul className="mt-4 divide-y divide-[var(--rule)]">
              {person.timeline.map((event) => (
                <li key={event.id} className="flex flex-wrap items-start gap-x-4 gap-y-2 py-3">
                  <span className="w-32 shrink-0 font-mono text-[11px] text-accent">
                    {formatDate(event.startDate, event.startPrecision) || 'Undated'}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[13.5px] font-medium text-ink">{event.title}</p>
                    {event.description ? (
                      <p className="mt-0.5 text-[12.5px] text-ink-muted">{event.description}</p>
                    ) : null}
                    {event.placeName ? (
                      <p className="mt-0.5 text-[11.5px] text-ink-faint">{event.placeName}</p>
                    ) : null}
                  </div>
                  <ActionForm
                    action={deleteTimelineEventAction}
                    className="flex items-center gap-2"
                    hiddenFields={{ id: event.id, personId: person.id }}
                    submitLabel="Remove"
                  >
                    <button
                      type="submit"
                      className="text-[12.5px] text-ink-faint transition-colors hover:text-accent"
                    >
                      Remove
                    </button>
                  </ActionForm>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState className="mt-4" title="No events yet" description="Add the first event below." />
          )}

          <details className="mt-4 rounded-[var(--radius-md)] border border-rule bg-surface p-4">
            <summary className="cursor-pointer text-small font-medium text-ink">
              Add a timeline event
            </summary>
            <ActionForm
              action={addTimelineEventAction}
              className="mt-4 space-y-4"
              hiddenFields={{ personId: person.id }}
              submitLabel="Add event"
            >
              <Field label="Title" name="title" required>
                <TextInput name="title" required />
              </Field>
              <Field label="Description" name="description">
                <TextArea name="description" rows={3} />
              </Field>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Field label="Date" name="startDate">
                  <TextInput name="startDate" placeholder="1843" />
                </Field>
                <Field label="Precision" name="startPrecision">
                  <Select name="startPrecision" defaultValue="year" options={PRECISIONS} />
                </Field>
                <Field label="Place" name="placeName">
                  <TextInput name="placeName" />
                </Field>
                <Field label="Source" name="sourceId">
                  <Select
                    name="sourceId"
                    placeholder="No source"
                    options={sources.map((s) => ({ value: s.id, label: s.title }))}
                  />
                </Field>
              </div>
            </ActionForm>
          </details>
        </section>
      ) : null}

      {/* ----------------------------------------------- relationships */}
      {person ? (
        <section className="mt-12">
          <h2 className="eyebrow border-t border-rule pt-4">Relationships</h2>
          {person.related.length > 0 ? (
            <ul className="mt-4 divide-y divide-[var(--rule)]">
              {person.related.map((rel) => (
                <li key={`${rel.slug}-${rel.relationship}`} className="flex flex-wrap items-start gap-x-4 gap-y-2 py-3">
                  <span className="w-36 shrink-0 font-mono text-[11px] uppercase tracking-[0.1em] text-accent">
                    {rel.relationship.replace(/_/g, ' ')}
                  </span>
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/admin/people?query=${encodeURIComponent(rel.fullName)}`}
                      className="text-[13.5px] font-medium text-ink hover:text-accent"
                    >
                      {rel.fullName}
                    </Link>
                    <p className="mt-0.5 text-[12.5px] text-ink-muted">{rel.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState
              className="mt-4"
              title="No relationships recorded"
              description="Record only connections the sources support."
            />
          )}

          <details className="mt-4 rounded-[var(--radius-md)] border border-rule bg-surface p-4">
            <summary className="cursor-pointer text-small font-medium text-ink">
              Add a relationship
            </summary>
            <ActionForm
              action={addRelationshipAction}
              className="mt-4 space-y-4"
              hiddenFields={{ personId: person.id }}
              submitLabel="Add relationship"
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Person" name="toPersonId" required>
                  <Select
                    name="toPersonId"
                    required
                    placeholder="Choose a person"
                    options={everyone
                      .filter((p) => p.id !== person.id)
                      .map((p) => ({ value: p.id, label: p.fullName }))}
                  />
                </Field>
                <Field label="Type" name="type" required>
                  <Select name="type" required options={RELATIONSHIP_TYPES} />
                </Field>
              </div>
              <Field label="Description" name="description" required>
                <TextArea name="description" rows={3} required />
              </Field>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Period note" name="periodNote">
                  <TextInput name="periodNote" placeholder="1842–1843" />
                </Field>
                <Field label="Source" name="sourceId">
                  <Select
                    name="sourceId"
                    placeholder="No source"
                    options={sources.map((s) => ({ value: s.id, label: s.title }))}
                  />
                </Field>
              </div>
            </ActionForm>
          </details>
        </section>
      ) : null}

      {/* ------------------------------------------------- source list */}
      {person ? (
        <section className="mt-12">
          <h2 className="eyebrow border-t border-rule pt-4">Sources</h2>
          {person.sources.length > 0 ? (
            <ul className="mt-4 divide-y divide-[var(--rule)]">
              {person.sources.map((source) => (
                <li key={source.id} className="flex flex-wrap items-center gap-x-4 gap-y-2 py-2.5">
                  <StatusPill status={source.verificationStatus} />
                  <span className="min-w-0 flex-1 truncate text-[13px] text-ink">
                    {source.url ? (
                      <a
                        href={source.url}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="hover:text-accent"
                      >
                        {source.title}
                      </a>
                    ) : (
                      source.title
                    )}
                  </span>
                  {source.locator ? (
                    <span className="font-mono text-[11px] text-ink-faint">{source.locator}</span>
                  ) : null}
                  <ActionForm
                    action={detachSourceAction}
                    hiddenFields={{ personId: person.id, sourceId: source.id }}
                    submitLabel="Detach"
                  >
                    <button
                      type="submit"
                      className="text-[12.5px] text-ink-faint transition-colors hover:text-accent"
                    >
                      Detach
                    </button>
                  </ActionForm>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState className="mt-4" title="No sources attached" description="Attach sources below." />
          )}

          <details className="mt-4 rounded-[var(--radius-md)] border border-rule bg-surface p-4">
            <summary className="cursor-pointer text-small font-medium text-ink">
              Attach a source
            </summary>
            <ActionForm
              action={attachSourceAction}
              className="mt-4 space-y-4"
              hiddenFields={{ personId: person.id }}
              submitLabel="Attach"
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Source" name="sourceId" required>
                  <Select
                    name="sourceId"
                    required
                    placeholder="Choose a source"
                    options={sources.map((s) => ({ value: s.id, label: s.title }))}
                  />
                </Field>
                <Field label="Locator" name="locator" hint="Page, section or passage.">
                  <TextInput name="locator" placeholder="p. 45" />
                </Field>
              </div>
            </ActionForm>
          </details>
        </section>
      ) : null}

      {/* ------------------------------------------------------ delete */}
      {person ? (
        <section className="mt-12">
          <h2 className="eyebrow border-t border-rule pt-4">Delete</h2>
          <p className="mt-3 max-w-[60ch] text-small text-ink-muted">
            Deleting a profile removes it, its timeline, its relationships and its source links.
            Archiving keeps the record and hides it from readers, which is usually the safer
            choice.
          </p>
          <ActionForm
            action={deletePersonAction}
            className="mt-4"
            hiddenFields={{ id: person.id }}
            requireConfirmation
            confirmLabel="Delete permanently"
            submitLabel="Delete this profile"
          />
        </section>
      ) : null}
    </div>
  );
}

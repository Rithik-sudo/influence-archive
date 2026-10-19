import type { Metadata } from 'next';
import { getEditorIdentity } from '@/server/auth/session';
import { listAdminMedia } from '@/server/queries/adminLists';
import { deleteMediaAction, uploadMediaAction } from '@/server/actions/content';
import { updateMediaAction as updateMedia } from '@/server/actions/people';
import { ActionForm } from '@/components/admin/ActionForm';
import { Field, TextInput } from '@/components/admin/Fields';
import { EmptyState } from '@/components/ui/States';

export const metadata: Metadata = { title: 'Media' };
export const dynamic = 'force-dynamic';

export default async function AdminMediaPage() {
  const identity = await getEditorIdentity();
  const media = await listAdminMedia(identity);

  return (
    <div>
      <header className="border-b border-rule pb-6">
        <p className="eyebrow">Library</p>
        <h1 className="mt-2 font-display text-[1.75rem] font-semibold text-ink">Media</h1>
        <p className="mt-1.5 text-small text-ink-muted">
          Every image is stored here with its licence, maker and credit. Nothing is hotlinked.
        </p>
      </header>

      <details className="mt-8 rounded-[var(--radius-md)] border border-rule bg-surface p-4">
        <summary className="cursor-pointer text-small font-medium text-ink">Upload an image</summary>
        <ActionForm
          action={uploadMediaAction}
          className="mt-4 space-y-4"
          submitLabel="Upload"
        >
          <Field label="Image file" name="file" required hint="JPEG, PNG, WebP or AVIF, up to 8 MB.">
            <input
              id="file"
              name="file"
              type="file"
              accept="image/jpeg,image/png,image/webp,image/avif"
              required
              className="h-10 w-full rounded-[var(--radius-md)] border border-rule bg-surface px-3 py-2 text-[13px] text-ink file:mr-3 file:rounded-[3px] file:border-0 file:bg-surface-sunken file:px-2 file:py-1 file:text-[12px] file:text-ink"
            />
          </Field>
          <Field label="Alt text" name="altText" required hint="Describe the image for someone who cannot see it.">
            <TextInput name="altText" required />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Caption" name="caption">
              <TextInput name="caption" />
            </Field>
            <Field label="Artist or maker" name="artist">
              <TextInput name="artist" />
            </Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Credit" name="credit">
              <TextInput name="credit" />
            </Field>
            <Field label="Licence" name="licenseName">
              <TextInput name="licenseName" placeholder="Public domain" />
            </Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Licence URL" name="licenseUrl">
              <TextInput name="licenseUrl" placeholder="https://" />
            </Field>
            <Field label="Source page" name="sourcePageUrl">
              <TextInput name="sourcePageUrl" placeholder="https://" />
            </Field>
          </div>
        </ActionForm>
      </details>

      {media.length === 0 ? (
        <EmptyState className="mt-8" title="No media yet" description="Upload the first image above." />
      ) : (
        <ul className="mt-8 space-y-4">
          {media.map((asset) => (
            <li key={asset.id} className="rounded-[var(--radius-md)] border border-rule bg-surface p-4">
              <div className="flex flex-wrap gap-5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`/media/${asset.path}`}
                  alt={asset.altText}
                  width={120}
                  height={120}
                  className="h-28 w-28 shrink-0 rounded-[var(--radius-sm)] bg-surface-sunken object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="font-mono text-[11px] text-ink-faint">{asset.path}</p>
                  <p className="mt-1 text-[13px] text-ink">{asset.altText}</p>
                  <p className="mt-1 font-mono text-[11px] text-ink-faint">
                    {[asset.artist, asset.credit, asset.licenseName].filter(Boolean).join(' · ') ||
                      'No attribution recorded'}
                  </p>
                </div>
              </div>

              <details className="mt-4">
                <summary className="cursor-pointer text-[13px] text-ink-muted hover:text-ink">
                  Edit attribution
                </summary>
                <ActionForm
                  action={updateMedia}
                  className="mt-3 space-y-3"
                  hiddenFields={{ id: asset.id }}
                  submitLabel="Save media details"
                >
                  <Field label="Alt text" name="altText" required>
                    <TextInput name="altText" defaultValue={asset.altText} required />
                  </Field>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Field label="Caption" name="caption">
                      <TextInput name="caption" defaultValue={asset.caption ?? ''} />
                    </Field>
                    <Field label="Artist or maker" name="artist">
                      <TextInput name="artist" defaultValue={asset.artist ?? ''} />
                    </Field>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Field label="Credit" name="credit">
                      <TextInput name="credit" defaultValue={asset.credit ?? ''} />
                    </Field>
                    <Field label="Licence" name="licenseName">
                      <TextInput name="licenseName" defaultValue={asset.licenseName ?? ''} />
                    </Field>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Field label="Licence URL" name="licenseUrl">
                      <TextInput name="licenseUrl" defaultValue={asset.licenseUrl ?? ''} />
                    </Field>
                    <Field label="Source page" name="sourcePageUrl">
                      <TextInput name="sourcePageUrl" defaultValue={asset.sourcePageUrl ?? ''} />
                    </Field>
                  </div>
                </ActionForm>
                <ActionForm
                  action={deleteMediaAction}
                  className="mt-3 border-t border-rule pt-3"
                  hiddenFields={{ id: asset.id }}
                  requireConfirmation
                  confirmLabel="Delete media record"
                  submitLabel="Delete this media record"
                />
              </details>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

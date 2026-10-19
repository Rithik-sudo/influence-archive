import type { Metadata } from 'next';
import { getEditorIdentity } from '@/server/auth/session';
import { getSiteSettings } from '@/server/queries/site';
import { saveSettingAction } from '@/server/actions/content';
import { ActionForm } from '@/components/admin/ActionForm';
import { Field, TextArea } from '@/components/admin/Fields';

export const metadata: Metadata = { title: 'Settings' };
export const dynamic = 'force-dynamic';

const SETTINGS = [
  { key: 'name', label: 'Publication name', hint: 'Shown in the header and the browser tab.' },
  { key: 'tagline', label: 'Tagline', hint: 'One line, used in metadata and the footer.' },
  { key: 'description', label: 'Description', hint: 'A sentence or two for search engines.' },
  { key: 'homeHeadline', label: 'Homepage headline', hint: 'The large statement on the front page.' },
  { key: 'homeStandfirst', label: 'Homepage standfirst', hint: 'The supporting paragraph beneath it.' },
  { key: 'contactEmail', label: 'Contact email', hint: 'Optional. Leave blank if there is none.' },
];

export default async function AdminSettingsPage() {
  const identity = await getEditorIdentity();
  const settings = await getSiteSettings(identity);

  return (
    <div>
      <header className="border-b border-rule pb-6">
        <p className="eyebrow">Configuration</p>
        <h1 className="mt-2 font-display text-[1.75rem] font-semibold text-ink">Settings</h1>
        <p className="mt-1.5 text-small text-ink-muted">
          The brand identity is configurable here, so the publication can be renamed without a
          code change.
        </p>
      </header>

      <ul className="mt-8 space-y-4">
        {SETTINGS.map((setting) => {
          const current = settings[setting.key];
          return (
            <li key={setting.key} className="rounded-[var(--radius-md)] border border-rule bg-surface p-4">
              <ActionForm
                action={saveSettingAction}
                className="space-y-3"
                hiddenFields={{ key: setting.key }}
                submitLabel="Save"
              >
                <Field label={setting.label} name="value" hint={setting.hint}>
                  <TextArea
                    name="value"
                    defaultValue={typeof current === 'string' ? current : ''}
                    rows={2}
                  />
                </Field>
              </ActionForm>
            </li>
          );
        })}
      </ul>

      <p className="mt-8 text-[12.5px] text-ink-faint">
        Unset values fall back to the compiled defaults in <code className="font-mono">src/lib/config.ts</code>.
      </p>
    </div>
  );
}

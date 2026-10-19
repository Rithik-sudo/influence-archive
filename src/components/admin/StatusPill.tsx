import { cn } from '@/lib/cn';

const STATUS_STYLES: Record<string, string> = {
  published: 'bg-sage-soft text-sage-deep',
  draft: 'bg-surface-sunken text-ink-muted',
  in_review: 'bg-accent-soft text-accent',
  archived: 'bg-surface-sunken text-ink-faint',
  checked: 'bg-sage-soft text-sage-deep',
  unverified: 'bg-surface-sunken text-ink-muted',
  failed: 'bg-accent-soft text-accent',
};

const STATUS_LABELS: Record<string, string> = {
  published: 'Published',
  draft: 'Draft',
  in_review: 'In review',
  archived: 'Archived',
  checked: 'Checked',
  unverified: 'Unverified',
  failed: 'Failed',
};

export function StatusPill({ status }: { status: string }) {
  return (
    <span
      className={cn(
        'inline-block rounded-[var(--radius-sm)] px-2 py-0.5 font-mono text-[10.5px] uppercase tracking-[0.1em]',
        STATUS_STYLES[status] ?? 'bg-surface-sunken text-ink-muted',
      )}
    >
      {STATUS_LABELS[status] ?? status.replace(/_/g, ' ')}
    </span>
  );
}

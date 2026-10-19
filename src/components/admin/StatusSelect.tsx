'use client';

import { useActionState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import type { ActionState } from '@/server/actions/shared';

const STATUSES = [
  { value: 'draft', label: 'Draft' },
  { value: 'in_review', label: 'In review' },
  { value: 'published', label: 'Published' },
  { value: 'archived', label: 'Archived' },
];

/**
 * A status control in a list row. The change is saved immediately, and the
 * button is disabled while the write is in flight so the row cannot be
 * double-submitted.
 */
export function StatusSelect({
  action,
  id,
  status,
  label,
  onChanged,
}: {
  action: (state: ActionState, formData: FormData) => Promise<ActionState>;
  id: string;
  status: string;
  label?: string;
  onChanged?: () => void;
}) {
  const [state, formAction, pending] = useActionState(action, {});
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.ok) {
      onChanged?.();
      router.refresh();
    }
  }, [state, onChanged, router]);

  return (
    <form ref={formRef} action={formAction} className="inline-flex items-center gap-1.5">
      <input type="hidden" name="id" value={id} />
      <label htmlFor={`status-${id}`} className="sr-only">
        {label ?? 'Status'}
      </label>
      <select
        id={`status-${id}`}
        name="status"
        defaultValue={status}
        disabled={pending}
        onChange={() => formRef.current?.requestSubmit()}
        className="h-8 rounded-[var(--radius-md)] border border-rule bg-surface px-2 text-[12.5px] text-ink outline-none focus:border-accent disabled:opacity-60"
      >
        {STATUSES.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {pending ? <Loader2 aria-hidden className="size-3.5 animate-spin text-ink-faint" /> : null}
      {state.error ? (
        <span role="alert" className="text-[12px] text-accent">
          {state.error}
        </span>
      ) : null}
    </form>
  );
}

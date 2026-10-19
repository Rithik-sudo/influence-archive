'use client';

import { useActionState, useEffect, useRef, useState } from 'react';
import { AlertTriangle, Check, Loader2 } from 'lucide-react';
import type { ActionState } from '@/server/actions/shared';

/**
 * The form wrapper used by every admin screen.
 *
 * It owns the action state, shows validation errors next to the form, warns
 * before an unsaved page is closed, and blocks a second submission while one
 * is in flight.
 */
export function ActionForm({
  action,
  children,
  submitLabel = 'Save',  className,
  hiddenFields,
  requireConfirmation,
  confirmLabel = 'Delete',
  onSuccess,
  childrenAfterSubmit,
}: {
  action: (state: ActionState, formData: FormData) => Promise<ActionState>;
  children?: React.ReactNode;
  submitLabel?: string;
  className?: string;
  hiddenFields?: Record<string, string>;
  requireConfirmation?: boolean;
  confirmLabel?: string;
  onSuccess?: (state: ActionState) => void;
  childrenAfterSubmit?: React.ReactNode;
}) {
  const [state, formAction, pending] = useActionState(action, {});
  const formRef = useRef<HTMLFormElement>(null);
  const [confirming, setConfirming] = useState(false);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    if (state.ok) onSuccess?.(state);
  }, [state, onSuccess]);

  useEffect(() => {
    if (!dirty) return;
    function warn(event: BeforeUnloadEvent) {
      event.preventDefault();
      event.returnValue = '';
    }
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    if (requireConfirmation && !confirming) {
      event.preventDefault();
      setConfirming(true);
      return;
    }
    setDirty(false);
  }

  const fieldErrors = state.fieldErrors ?? {};

  return (
    <form
      ref={formRef}
      action={formAction}
      onSubmit={handleSubmit}
      onChange={() => setDirty(true)}
      className={className}
      noValidate
    >
      {hiddenFields
        ? Object.entries(hiddenFields).map(([name, value]) => (
            <input key={name} type="hidden" name={name} value={value} />
          ))
        : null}

      {children}

      {state.error ? (
        <p
          role="alert"
          className="mt-6 flex items-start gap-2 rounded-[var(--radius-md)] border border-accent bg-accent-soft px-3 py-2 text-small text-accent"
        >
          <AlertTriangle aria-hidden className="mt-0.5 size-4 shrink-0" strokeWidth={1.75} />
          <span>
            {state.error}
            {Object.keys(fieldErrors).length > 0 ? (
              <ul className="mt-1 list-disc pl-4">
                {Object.entries(fieldErrors).map(([field, messages]) => (
                  <li key={field}>
                    <span className="font-medium">{field}</span>: {messages.join(' ')}
                  </li>
                ))}
              </ul>
            ) : null}
          </span>
        </p>
      ) : null}

      {state.ok && state.message ? (
        <p
          role="status"
          className="mt-6 flex items-center gap-2 rounded-[var(--radius-md)] border border-rule bg-surface-sunken px-3 py-2 text-small text-ink"
        >
          <Check aria-hidden className="size-4 text-sage-deep" strokeWidth={2} />
          {state.message}
        </p>
      ) : null}

      {requireConfirmation && confirming ? (
        <div className="mt-6 rounded-[var(--radius-md)] border border-accent bg-accent-soft p-4">
          <p className="text-small text-ink">
            This cannot be undone. Type <strong>DELETE</strong> to confirm.
          </p>
          <div className="mt-3 flex items-center gap-3">
            <input
              name="confirm"
              type="text"
              autoComplete="off"
              placeholder="DELETE"
              className="h-9 w-32 rounded-[var(--radius-md)] border border-rule bg-surface px-2.5 font-mono text-[13px] uppercase outline-none focus:border-accent"
            />
            <button
              type="submit"
              disabled={pending}
              className="h-9 rounded-[var(--radius-md)] bg-accent px-3.5 text-[13px] font-medium text-accent-ink transition-colors hover:bg-accent-hover disabled:opacity-60"
            >
              {confirmLabel}
            </button>
            <button
              type="button"
              onClick={() => setConfirming(false)}
              className="text-[13px] text-ink-muted underline underline-offset-4 hover:text-ink"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-6 flex items-center gap-3">
          <button
            type="submit"
            disabled={pending}
            className="inline-flex h-10 items-center gap-2 rounded-[var(--radius-md)] bg-accent px-4 text-small font-medium text-accent-ink transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-60"
          >
            {pending ? <Loader2 aria-hidden className="size-3.5 animate-spin" /> : null}
            {pending ? 'Working…' : submitLabel}
          </button>
          {dirty ? (
            <span className="font-mono text-[11px] text-ink-faint">Unsaved changes</span>
          ) : null}
        </div>
      )}

      {childrenAfterSubmit}
    </form>
  );
}

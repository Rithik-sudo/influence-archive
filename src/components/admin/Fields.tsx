'use client';

import { useId, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/cn';

export function Field({
  label,
  name,
  children,
  hint,
  error,
  required,
  className,
}: {
  label: string;
  name?: string;
  children?: React.ReactNode;
  hint?: string;
  error?: string;
  required?: boolean;
  className?: string;
}) {
  const id = useId();
  return (
    <div className={cn('space-y-1.5', className)}>
      <label htmlFor={name ?? id} className="eyebrow block">
        {label}
        {required ? <span className="text-accent"> *</span> : null}
      </label>
      {children}
      {hint && !error ? <p className="text-[12px] leading-relaxed text-ink-faint">{hint}</p> : null}
      {error ? (
        <p className="text-[12px] text-accent" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

const inputClass =
  'h-10 w-full rounded-[var(--radius-md)] border border-rule bg-surface px-3 text-small text-ink outline-none transition-colors placeholder:text-ink-faint focus:border-accent disabled:opacity-60';

export function TextInput({
  name,
  defaultValue,
  placeholder,
  type = 'text',
  required,
  disabled,
  readOnly,
  className,
}: {
  name: string;
  defaultValue?: string | number | null;
  placeholder?: string;
  type?: string;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  className?: string;
}) {
  return (
    <input
      id={name}
      name={name}
      type={type}
      defaultValue={defaultValue ?? ''}
      placeholder={placeholder}
      required={required}
      disabled={disabled}
      readOnly={readOnly}
      className={cn(inputClass, className)}
    />
  );
}

export function TextArea({
  name,
  defaultValue,
  rows = 4,
  placeholder,
  required,
  className,
  mono,
}: {
  name: string;
  defaultValue?: string | null;
  rows?: number;
  placeholder?: string;
  required?: boolean;
  className?: string;
  mono?: boolean;
}) {
  return (
    <textarea
      id={name}
      name={name}
      rows={rows}
      defaultValue={defaultValue ?? ''}
      placeholder={placeholder}
      required={required}
      className={cn(
        'w-full rounded-[var(--radius-md)] border border-rule bg-surface px-3 py-2 text-small leading-relaxed text-ink outline-none transition-colors placeholder:text-ink-faint focus:border-accent',
        mono && 'font-mono text-[13px]',
        className,
      )}
    />
  );
}

export function Select({
  name,
  defaultValue,
  options,
  required,
  className,
  placeholder,
}: {
  name: string;
  defaultValue?: string | null;
  options: { value: string; label: string }[];
  required?: boolean;
  className?: string;
  placeholder?: string;
}) {
  return (
    <select
      id={name}
      name={name}
      defaultValue={defaultValue ?? ''}
      required={required}
      className={cn(inputClass, 'appearance-none pr-8', className)}
    >
      {placeholder !== undefined ? <option value="">{placeholder}</option> : null}
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

export function Checkbox({
  name,
  defaultChecked,
  label,
  hint,
}: {
  name: string;
  defaultChecked?: boolean;
  label: string;
  hint?: string;
}) {
  const id = useId();
  return (
    <div className="flex items-start gap-2.5">
      <input
        id={id}
        name={name}
        type="checkbox"
        value="on"
        defaultChecked={defaultChecked}
        className="mt-0.5 size-4 shrink-0 accent-[var(--accent)]"
      />
      <label htmlFor={id} className="text-small text-ink">
        {label}
        {hint ? <span className="mt-0.5 block text-[12px] text-ink-faint">{hint}</span> : null}
      </label>
    </div>
  );
}

/** A multi-select rendered as a list of checkboxes, so it works without JS. */
export function CheckboxList({
  name,
  options,
  defaultValues = [],
  columns = 2,
}: {
  name: string;
  options: { value: string; label: string; group?: string }[];
  defaultValues?: string[];
  columns?: 1 | 2 | 3;
}) {
  const selected = new Set(defaultValues);
  const groups = new Map<string, typeof options>();
  for (const option of options) {
    const key = option.group ?? '';
    groups.set(key, [...(groups.get(key) ?? []), option]);
  }

  return (
    <div className="space-y-3">
      {[...groups.entries()].map(([group, items]) => (
        <fieldset key={group} className="space-y-2">
          {group ? <legend className="eyebrow mb-1">{group}</legend> : null}
          <div
            className={cn(
              'grid gap-x-4 gap-y-1.5',
              columns === 1 && 'grid-cols-1',
              columns === 2 && 'sm:grid-cols-2',
              columns === 3 && 'sm:grid-cols-3',
            )}
          >
            {items.map((option) => (
              <label
                key={option.value}
                className="flex items-center gap-2 text-[13px] text-ink-muted"
              >
                <input
                  type="checkbox"
                  name={`${name}[]`}
                  value={option.value}
                  defaultChecked={selected.has(option.value)}
                  className="size-3.5 shrink-0 accent-[var(--accent)]"
                />
                {option.label}
              </label>
            ))}
          </div>
        </fieldset>
      ))}
    </div>
  );
}

export function Disclosure({
  summary,
  children,
  defaultOpen = false,
}: {
  summary: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-t border-rule pt-3">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-3 text-left text-small font-medium text-ink"
      >
        {summary}
        <ChevronDown
          aria-hidden
          className={cn('size-4 shrink-0 text-ink-faint transition-transform', open && 'rotate-180')}
          strokeWidth={1.75}
        />
      </button>
      {open ? <div className="mt-4">{children}</div> : null}
    </div>
  );
}

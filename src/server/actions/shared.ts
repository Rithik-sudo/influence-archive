import { revalidatePath } from 'next/cache';
import { sql } from 'drizzle-orm';
import { withDb } from '@/server/db/tx';
import { auditLog } from '@/server/db/schema';
import { getEditor } from '@/server/auth/guards';
import type { SessionUser } from '@/server/auth/session';
import { type ZodError, type ZodType } from 'zod';

/**
 * Shared helpers for the admin server actions.
 *
 * This module deliberately does not carry the `use server` directive: such a
 * module may only export async functions, and these are ordinary helpers.
 * The action modules that do carry it import from here.
 */

/**
 * The shape every admin action returns, so the forms can render errors and
 * confirmations consistently.
 */
export type ActionState = {
  ok?: boolean;
  error?: string;
  message?: string;
  /** Field-level messages, keyed by field name. */
  fieldErrors?: Record<string, string[]>;
  /** Set when the action succeeded, so the form can show a confirmation. */
  savedAt?: string;
};

export const emptyState: ActionState = {};

/**
 * The authorisation boundary for every editorial mutation.
 *
 * The check is repeated here, on the server, for every action — hiding a
 * button is not protection. The database enforces the row-level rules as
 * well, so an action that slipped past this would still be refused.
 */
export async function requireEditorForAction(): Promise<SessionUser | null> {
  return getEditor();
}

export function fieldErrorsFrom(error: ZodError): Record<string, string[]> {
  const out: Record<string, string[]> = {};
  for (const issue of error.issues) {
    const key = issue.path.join('.') || '_';
    (out[key] ??= []).push(issue.message);
  }
  return out;
}

export async function recordAudit(
  user: SessionUser | null,
  action: string,
  entityType: string,
  entityId?: string | null,
  detail?: string | null,
): Promise<void> {
  await withDb(async (tx) => {
    await tx.insert(auditLog).values({
      userId: user?.id ?? null,
      action,
      entityType,
      entityId: entityId ?? null,
      detail: detail ?? null,
    });
  });
}

/** Parses a form payload into a validated object, or throws a ZodError. */
export async function parseForm<T>(
  schema: ZodType<T>,
  formData: FormData,
): Promise<T> {
  const raw: Record<string, unknown> = {};

  for (const [key, value] of formData.entries()) {
    if (key.startsWith('$ACTION')) continue;
    if (key.endsWith('[]')) {
      const listKey = key.slice(0, -2);
      const existing = Array.isArray(raw[listKey]) ? (raw[listKey] as unknown[]) : [];
      existing.push(value);
      raw[listKey] = existing;
      continue;
    }
    if (key in raw) {
      const existing = raw[key];
      raw[key] = Array.isArray(existing) ? [...existing, value] : [existing, value];
    } else {
      raw[key] = value;
    }
  }

  // Unchecked checkboxes are absent from the payload entirely.
  for (const key of Object.keys(raw)) {
    if (raw[key] === undefined) raw[key] = '';
  }

  return schema.parse(raw);
}

/** Splits a comma or newline separated list into clean entries. */
export function splitList(value: string | undefined): string[] {
  if (!value) return [];
  return value
    .split(/[\n,]/)
    .map((entry) => entry.trim())
    .filter(Boolean);
}

export function revalidatePublic(personSlug?: string | null): void {
  revalidatePath('/');
  revalidatePath('/explore');
  revalidatePath('/categories');
  revalidatePath('/collections');
  revalidatePath('/articles');
  revalidatePath('/sitemap.xml');
  if (personSlug) {
    revalidatePath(`/people/${personSlug}`);
  }
}

export { sql };

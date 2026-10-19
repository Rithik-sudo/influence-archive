import 'server-only';
import { sql } from 'drizzle-orm';
import { createDatabase, type Database } from './client';

/**
 * The single door to the database.
 *
 * Every statement runs inside a transaction that:
 *   1. drops to the unprivileged `archive_app` role (so RLS applies), and
 *   2. sets the request-scoped identity (`app.user_id`, `app.user_role`).
 *
 * Because `SET LOCAL` is transaction-scoped, the identity can never leak into
 * another request, and because the role is not a superuser and owns no
 * tables, a forgotten `status = 'published'` filter cannot expose a draft.
 *
 * `set_config(..., true)` is used rather than `SET LOCAL` because `SET` is a
 * utility statement and cannot carry bind parameters.
 */

export type DbTransaction = Parameters<Parameters<Database['transaction']>[0]>[0];

export type EditorIdentity = {
  userId?: string | null;
  role?: 'admin' | 'editor' | null;
};

/**
 * Normalises the result of a raw query.
 *
 * The two drivers return raw rows in different shapes: postgres-js hands back
 * the row array directly, PGlite wraps it in `{ rows }`. Everything in the
 * data-access layer goes through this helper so the two are interchangeable.
 */
export function rowsOf<T>(result: unknown): T[] {
  if (Array.isArray(result)) return result as T[];
  if (result && typeof result === 'object' && 'rows' in result) {
    const rows = (result as { rows: unknown }).rows;
    if (Array.isArray(rows)) return rows as T[];
  }
  return [];
}

let database: Database | null = null;
let databasePromise: Promise<Database> | null = null;

export async function getDb(): Promise<Database> {
  if (database) return database;
  databasePromise ??= createDatabase().then((next) => {
    database = next;
    return next;
  });
  return databasePromise;
}

/** Test seam: inject a database (e.g. an in-memory PGlite) into the DAL. */
export function setDb(next: Database | null): void {
  database = next;
  databasePromise = next ? Promise.resolve(next) : null;
}

/**
 * Closes the database connection so a script can exit.
 *
 * PGlite holds the process open, which would leave a migration or seed run
 * hanging after it has finished its work.
 */
export async function closeDb(): Promise<void> {
  const current = database;
  database = null;
  databasePromise = null;

  if (!current) return;

  try {
    const client = (current as unknown as { $client?: { close?: () => Promise<void> } }).$client;
    await client?.close?.();
  } catch {
    // Closing a database that is already closed is not an error worth raising.
  }
}

/**
 * Resolves the identity of the signed-in user when a caller does not pass
 * one explicitly.
 *
 * Most callers are server actions, which run in a request context and already
 * know who is signed in. Reading the session here means a mutation cannot
 * accidentally run with no identity — which the database would refuse — and
 * removes a whole class of mistakes.
 */
async function resolveCurrentIdentity(): Promise<EditorIdentity> {
  try {
    const { getSessionUser } = await import('@/server/auth/session');
    const user = await getSessionUser();
    if (!user) return {};
    return { userId: user.id, role: user.role };
  } catch {
    // No request context (a script, or a background task): no identity.
    return {};
  }
}

export async function withDb<T>(
  fn: (tx: DbTransaction) => Promise<T>,
  identity?: EditorIdentity,
): Promise<T> {
  const db = await getDb();
  const resolved = identity ?? (await resolveCurrentIdentity());
  const userId = resolved.userId ?? '';
  const role = resolved.role ?? '';

  return db.transaction(async (tx) => {
    await tx.execute(sql`set local role archive_app`);
    await tx.execute(sql`select set_config('app.user_id', ${userId}, true)`);
    await tx.execute(sql`select set_config('app.user_role', ${role}, true)`);
    return fn(tx);
  });
}

/**
 * Runs privileged work (migrations, seeding) that must bypass RLS.
 * Only the migrator and the seed script may call this.
 */
export async function withPrivilegedDb<T>(fn: (tx: DbTransaction) => Promise<T>): Promise<T> {
  const db = await getDb();
  return db.transaction(async (tx) => {
    await tx.execute(sql`select set_config('app.user_id', '', true)`);
    await tx.execute(sql`select set_config('app.user_role', '', true)`);
    return fn(tx);
  });
}

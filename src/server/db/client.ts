import 'server-only';
import { drizzle as drizzlePglite } from 'drizzle-orm/pglite';
import { drizzle as drizzlePostgres, type PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';
import { createPglite } from './pglite';

/**
 * One database, two ways to reach it.
 *
 *  - A normal PostgreSQL over TCP, which is how the application always talks
 *    to the database. In development that is the local PGlite server started
 *    by `npm run db:serve`; in production it is a managed instance.
 *  - An in-process PGlite, used only by the test harness, where a private
 *    in-memory database is wanted.
 *
 * The privileged connection is deliberately not exported. Application code can
 * only reach the database through `withDb` (src/server/db/tx.ts), which drops
 * to the unprivileged `archive_app` role so that row level security is always
 * in force.
 */

export const LOCAL_DATABASE_URL = `postgres://postgres@127.0.0.1:${
  process.env.PGLITE_PORT ?? '5433'
}/postgres`;

/**
 * `PostgresJsDatabase` is used as the canonical type for both backends. The
 * two drivers expose an identical query-builder API; they differ only in the
 * type of a raw query result, which is irrelevant to the data-access layer.
 */
export type Database = PostgresJsDatabase<typeof schema>;

function isPostgresUrl(url: string): boolean {
  return url.startsWith('postgres://') || url.startsWith('postgresql://');
}

export async function createDatabase(): Promise<Database> {
  const url = process.env.DATABASE_URL?.trim();

  if (url && url.startsWith('pglite:')) {
    const client = await createPglite(url.slice('pglite:'.length));
    return drizzlePglite(client, { schema }) as unknown as Database;
  }

  const connectionString = url && isPostgresUrl(url) ? url : LOCAL_DATABASE_URL;

  const client = postgres(connectionString, {
    max: Number(process.env.DATABASE_POOL_SIZE ?? 10),
    onnotice: () => {},
  });

  return drizzlePostgres(client, { schema });
}

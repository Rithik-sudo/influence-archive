import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { drizzle } from 'drizzle-orm/pglite';
import { createPglite } from '@/server/db/pglite';
import * as schema from '@/server/db/schema';
import { setDb } from '@/server/db/tx';

const DRIZZLE_DIR = path.resolve(import.meta.dirname, '../../drizzle');

/**
 * Boots a throwaway PostgreSQL (PGlite, in memory) with the real migrations
 * applied, and points the data-access layer at it.
 *
 * The migrations are the same files the application runs, so the tests
 * exercise the actual schema, the actual role and the actual RLS policies.
 */
export async function createTestDatabase() {
  const client = await createPglite();

  const files = (await readdir(DRIZZLE_DIR)).filter((f) => f.endsWith('.sql')).sort();

  for (const file of files) {
    const raw = await readFile(path.join(DRIZZLE_DIR, file), 'utf8');
    const statements = raw
      .split('--> statement-breakpoint')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    await client.exec('BEGIN');
    try {
      for (const statement of statements) {
        await client.exec(statement);
      }
      await client.exec('COMMIT');
    } catch (error) {
      await client.exec('ROLLBACK');
      throw new Error(
        `Migration ${file} failed: ${(error as Error).message}`,
      );
    }
  }

  const db = drizzle(client, { schema });
  setDb(db as never);

  return {
    client,
    db,
    async close() {
      setDb(null);
      await client.close();
    },
  };
}

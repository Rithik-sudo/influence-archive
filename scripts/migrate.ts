/**
 * Migration runner.
 *
 * Applies every `drizzle/*.sql` file in filename order, inside a transaction,
 * and records what it applied in `_migrations`. Running it twice is a no-op.
 *
 * The SQL files are the source of truth for schema changes. `drizzle-kit
 * generate` produces the baseline; `0001_security.sql` holds the hand-written
 * role, policy and trigger definitions that the ORM cannot express.
 *
 * The migrations are applied over the same connection the application uses, so
 * the local development database and a managed instance behave identically.
 */
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import postgres from 'postgres';
import { LOCAL_DATABASE_URL } from '../src/server/db/client';

const DRIZZLE_DIR = path.resolve(process.cwd(), 'drizzle');

function splitStatements(sql: string): string[] {
  return sql
    .split('--> statement-breakpoint')
    .map((part) => part.trim())
    .filter((part) => part.length > 0);
}

async function listMigrationFiles(): Promise<string[]> {
  const files = await readdir(DRIZZLE_DIR);
  return files.filter((f) => f.endsWith('.sql')).sort();
}

async function main() {
  const url = process.env.DATABASE_URL?.trim() || LOCAL_DATABASE_URL;
  const files = await listMigrationFiles();

  if (files.length === 0) {
    console.error('No migration files found in drizzle/.');
    process.exit(1);
  }

  const sql = postgres(url, { max: 1, onnotice: () => {} });

  await sql`
    CREATE TABLE IF NOT EXISTS _migrations (
      name text PRIMARY KEY,
      applied_at timestamptz NOT NULL DEFAULT now()
    )
  `;

  const rows = await sql<{ name: string }[]>`SELECT name FROM _migrations`;
  const applied = new Set(rows.map((row) => row.name));

  for (const file of files) {
    if (applied.has(file)) {
      console.log(`  = ${file} (already applied)`);
      continue;
    }

    const statements = splitStatements(await readFile(path.join(DRIZZLE_DIR, file), 'utf8'));

    await sql.begin(async (tx) => {
      for (const statement of statements) {
        await tx.unsafe(statement);
      }
      await tx`INSERT INTO _migrations (name) VALUES (${file}) ON CONFLICT DO NOTHING`;
    });

    console.log(`  + ${file}`);
  }

  await sql.end();
  console.log('Migrations are up to date.');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

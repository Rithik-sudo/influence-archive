import { defineConfig } from 'drizzle-kit';

/**
 * Drizzle Kit is used only to *generate* SQL from `src/server/db/schema.ts`.
 * Migrations are applied by `scripts/migrate.ts`, which runs every file in
 * `drizzle/` in filename order and records what it has applied.
 *
 * The local database is a real PostgreSQL instance (PGlite) so the generated
 * SQL is the same dialect that runs in production.
 */
export default defineConfig({
  dialect: 'postgresql',
  driver: 'pglite',
  schema: './src/server/db/schema.ts',
  out: './drizzle',
  dbCredentials: {
    url: process.env.PGLITE_PATH ?? './.data/pglite',
  },
  verbose: true,
  strict: false,
});

#!/usr/bin/env tsx
/**
 * Runs the local database as a PostgreSQL server.
 *
 * PGlite is a single-writer database, and a Next.js dev server runs more than
 * one process. Exposing the database over the PostgreSQL wire protocol gives
 * the whole application one writer and many clients, and means the
 * application talks to the local database with exactly the same driver it
 * uses in production.
 *
 *   npm run db:serve
 *
 * The server listens on 127.0.0.1:5433 by default and stores its data in
 * .data/pglite. Stop it with Ctrl-C.
 */
import path from 'node:path';
import { createPglite } from '../src/server/db/pglite';
import { PGLiteSocketServer } from '@electric-sql/pglite-socket';

const PORT = Number(process.env.PGLITE_PORT ?? 5433);
const HOST = process.env.PGLITE_HOST ?? '127.0.0.1';
const DATA_DIR = process.env.PGLITE_PATH ?? './.data/pglite';

async function main() {
  const db = await createPglite(path.resolve(process.cwd(), DATA_DIR));

  const server = new PGLiteSocketServer({
    db,
    port: PORT,
    host: HOST,
    // The application opens a pool of ten connections, and a test run opens
    // another pool alongside it. The limit has to sit above the total, or the
    // server resets the connections it cannot serve.
    maxConnections: 40,
  });

  await server.start();

  console.log(`Local database listening on ${HOST}:${PORT}`);
  console.log(`  data directory: ${DATA_DIR}`);
  console.log(`  connection url: postgres://postgres@${HOST}:${PORT}/postgres`);
  console.log('');
  console.log('Leave this running while you work. Press Ctrl-C to stop.');

  let stopping = false;
  const stop = async () => {
    if (stopping) return;
    stopping = true;
    console.log('');
    console.log('Stopping the local database…');
    await server.stop();
    await db.close();
    process.exit(0);
  };

  process.on('SIGINT', stop);
  process.on('SIGTERM', stop);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

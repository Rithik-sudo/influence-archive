#!/usr/bin/env tsx
/**
 * Development launcher.
 *
 * Starts the local database server and then the Next.js development server,
 * and shuts both down together. The database has to be a separate process
 * because PGlite allows a single writer and the Next.js dev server runs more
 * than one.
 *
 *   npm run dev
 *
 * Set `PGLITE_PORT` to move the database, or run `npm run dev:app` on its own
 * if a database server is already running.
 */
import { spawn, type ChildProcess } from 'node:child_process';
import net from 'node:net';
import postgres from 'postgres';

const PORT = Number(process.env.PGLITE_PORT ?? 5433);
const HOST = '127.0.0.1';
const APP_PORT = process.env.PORT ?? '3000';

const children: ChildProcess[] = [];

function portOpen(host: string, port: number): Promise<boolean> {
  return new Promise((resolve) => {
    const socket = net.connect({ host, port });
    const finish = (open: boolean) => {
      socket.destroy();
      resolve(open);
    };
    socket.setTimeout(500);
    socket.once('connect', () => finish(true));
    socket.once('error', () => finish(false));
    socket.once('timeout', () => finish(false));
  });
}

/** A port being open does not mean the database is healthy. */
async function databaseAnswers(host: string, port: number): Promise<boolean> {
  const client = postgres(`postgres://postgres@${host}:${port}/postgres`, {
    max: 1,
    connect_timeout: 3,
    onnotice: () => {},
  });
  try {
    await client`select 1`;
    return true;
  } catch {
    return false;
  } finally {
    await client.end({ timeout: 1 }).catch(() => undefined);
  }
}

async function waitForPort(host: string, port: number, timeoutMs: number): Promise<boolean> {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    if (await portOpen(host, port)) return true;
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  return false;
}

function run(command: string, args: string[], env: Record<string, string> = {}): ChildProcess {
  const child = spawn(command, args, {
    stdio: 'inherit',
    env: { ...process.env, ...env },
    shell: false,
  });
  children.push(child);
  return child;
}

function shutdown(code = 0) {
  for (const child of children) {
    if (!child.killed) child.kill('SIGTERM');
  }
  process.exit(code);
}

process.on('SIGINT', () => shutdown(0));
process.on('SIGTERM', () => shutdown(0));

async function main() {
  if (await portOpen(HOST, PORT)) {
    if (await databaseAnswers(HOST, PORT)) {
      console.log(`Using the database already listening on ${HOST}:${PORT}.`);
    } else {
      console.error(
        `Something is listening on ${HOST}:${PORT} but it is not answering queries.\n` +
          'Stop that process and try again. If it is a stale local database, remove the ' +
          'lock file and the data directory and start over.',
      );
      shutdown(1);
    }
  } else {
    console.log('Starting the local database…');
    const database = run('node', ['--conditions', 'react-server', '--import', 'tsx', 'scripts/db-serve.ts']);

    database.on('exit', (code) => {
      if (code !== 0 && code !== null) {
        console.error('The local database stopped unexpectedly.');
        shutdown(code);
      }
    });

    const ready = await waitForPort(HOST, PORT, 60_000);
    if (!ready) {
      console.error('The local database did not start in time.');
      shutdown(1);
    }
    if (!(await databaseAnswers(HOST, PORT))) {
      console.error('The local database started but does not answer queries.');
      shutdown(1);
    }
  }

  console.log('');
  run('node', ['node_modules/next/dist/bin/next', 'dev', '--port', APP_PORT]);
}

main().catch((error) => {
  console.error(error);
  shutdown(1);
});

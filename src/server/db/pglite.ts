import { readFileSync } from 'node:fs';
import { mkdir, open, readFile, unlink } from 'node:fs/promises';
import { createRequire } from 'node:module';
import path from 'node:path';
import { PGlite, type PGliteOptions } from '@electric-sql/pglite';

/**
 * PGlite normally fetches its own WASM and data bundle relative to
 * `import.meta.url`. Inside a bundled Next.js server that URL is rewritten and
 * no longer points at the real files, so the artifacts are read from disk and
 * handed to PGlite explicitly. This keeps development, the production build
 * and the test suite on exactly the same code path.
 */

const require = createRequire(path.join(process.cwd(), 'package.json'));

function pgliteDistPath(): string {
  // The package does not export "./package.json", so resolve the entry point
  // and take its directory.
  return path.dirname(require.resolve('@electric-sql/pglite'));
}

let artifactsPromise: Promise<PgliteArtifacts> | null = null;

type PgliteArtifacts = {
  pgliteWasmModule: WebAssembly.Module;
  initdbWasmModule: WebAssembly.Module;
  fsBundle: Blob;
};

async function loadArtifacts(): Promise<PgliteArtifacts> {
  const dist = pgliteDistPath();

  const [wasm, initdb, data] = await Promise.all([
    readFile(path.join(dist, 'pglite.wasm')),
    readFile(path.join(dist, 'initdb.wasm')),
    readFile(path.join(dist, 'pglite.data')),
  ]);

  const [pgliteWasmModule, initdbWasmModule] = await Promise.all([
    WebAssembly.compile(wasm),
    WebAssembly.compile(initdb),
  ]);

  return {
    pgliteWasmModule,
    initdbWasmModule,
    fsBundle: new Blob([data]),
  };
}

export function getPgliteArtifacts(): Promise<PgliteArtifacts> {
  artifactsPromise ??= loadArtifacts();
  return artifactsPromise;
}

/**
 * PGlite runs a single process against a single data directory, and two
 * unrelated processes opening the same directory will corrupt it. A lock file
 * makes the second process fail immediately with an explanation rather than
 * hang.
 *
 * Processes that share an ancestry — the dev server and its render workers,
 * or a script and its parent — are allowed through, because they are the same
 * logical application and cannot run concurrently anyway.
 */
const lockPaths = new Set<string>();

/** Reads the parent pid of a process, or null if it cannot be determined. */
function parentPidOf(pid: number): number | null {
  try {
    const stat = readFileSync(`/proc/${pid}/stat`, 'utf8');
    // The comm field may contain spaces, so parse after the closing bracket.
    const after = stat.slice(stat.lastIndexOf(')') + 2).split(' ');
    const ppid = Number(after[1]);
    return Number.isInteger(ppid) && ppid > 0 ? ppid : null;
  } catch {
    return null;
  }
}

/**
 * True when one process is a strict ancestor of the other.
 *
 * Siblings do not count: two scripts launched from the same shell are
 * independent, and only one of them may hold the database.
 */
function areRelated(a: number, b: number): boolean {
  if (a === b) return true;

  // Is `a` an ancestor of `b`?
  let current: number | null = parentPidOf(b);
  while (current && current > 1) {
    if (current === a) return true;
    current = parentPidOf(current);
  }

  // Is `b` an ancestor of `a`?
  current = parentPidOf(a);
  while (current && current > 1) {
    if (current === b) return true;
    current = parentPidOf(current);
  }

  return false;
}

async function acquireLock(dataDir: string): Promise<void> {
  const lockPath = path.join(dataDir, '.lock');

  try {
    await mkdir(dataDir, { recursive: true });
  } catch {
    // The directory may already exist; PGlite will report the real problem.
  }

  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      const handle = await open(lockPath, 'wx');
      await handle.writeFile(String(process.pid));
      await handle.close();
      lockPaths.add(lockPath);
      process.once('exit', () => {
        void unlink(lockPath).catch(() => undefined);
      });
      return;
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== 'EEXIST') throw error;

      const contents = await readFile(lockPath, 'utf8').catch(() => '');
      const pid = Number(contents.trim());
      const known = Number.isInteger(pid) && pid > 0;

      if (known && areRelated(pid, process.pid)) {
        // The same logical application (or a previous handle in this process).
        return;
      }

      if (known && isProcessAlive(pid)) {
        throw new Error(
          `The local database at ${dataDir} is already open by another process (pid ${pid}).\n` +
            'PGlite allows a single writer. Stop the dev server before running the seed ' +
            'script, or set DATABASE_URL to point at a separate PostgreSQL instance.',
        );
      }

      // A stale lock from a process that is no longer running.
      await unlink(lockPath).catch(() => undefined);
    }
  }
}

function isProcessAlive(pid: number): boolean {
  try {
    process.kill(pid, 0);
    return true;
  } catch (error) {
    return (error as NodeJS.ErrnoException).code === 'EPERM';
  }
}

/** Creates a PGlite instance with its artifacts resolved from disk. */
export async function createPglite(dataDir?: string): Promise<PGlite> {
  const artifacts = await getPgliteArtifacts();
  const options: PGliteOptions = {
    pgliteWasmModule: artifacts.pgliteWasmModule,
    initdbWasmModule: artifacts.initdbWasmModule,
    fsBundle: artifacts.fsBundle,
  };

  if (dataDir) {
    await acquireLock(dataDir);
  }

  const client = dataDir ? new PGlite(dataDir, options) : new PGlite(options);
  await client.waitReady;
  return client;
}

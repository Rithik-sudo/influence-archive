import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const CACHE_DIR = path.resolve(process.cwd(), '.cache', 'seed');
const USER_AGENT =
  'InfluenceArchiveSeed/0.1 (editorial seed script; https://example.invalid/contact)';

/** Minimum gap between requests, in milliseconds. */
const THROTTLE_MS = 1200;

let lastRequestAt = 0;

async function throttle(): Promise<void> {
  const wait = lastRequestAt + THROTTLE_MS - Date.now();
  if (wait > 0) await new Promise((resolve) => setTimeout(resolve, wait));
  lastRequestAt = Date.now();
}

function cacheKey(url: string): string {
  return createHash('sha256').update(url).digest('hex').slice(0, 32);
}

async function readCache<T>(key: string): Promise<T | null> {
  try {
    const raw = await readFile(path.join(CACHE_DIR, `${key}.json`), 'utf8');
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

async function writeCache(key: string, value: unknown): Promise<void> {
  await mkdir(CACHE_DIR, { recursive: true });
  await writeFile(path.join(CACHE_DIR, `${key}.json`), JSON.stringify(value), 'utf8');
}

export type FetchOptions = {
  /** Use the on-disk cache and skip the network entirely. */
  offline?: boolean;
  retries?: number;
};

export type FetchResult<T> = {
  data: T;
  /** True when the response came from the on-disk cache. */
  cached: boolean;
  status: number;
};

/**
 * A polite, throttled, cached HTTP GET.
 *
 * The Wikimedia APIs rate-limit aggressively, so requests are spaced out, the
 * response is cached on disk, and a 429 is retried with a backoff. Running the
 * seed twice does not hit the network twice.
 */
export async function fetchJson<T>(
  url: string,
  options: FetchOptions = {},
): Promise<FetchResult<T>> {
  const key = cacheKey(url);
  const cached = await readCache<{ data: T; status: number }>(key);
  if (cached) {
    return { data: cached.data, cached: true, status: cached.status };
  }

  if (options.offline) {
    throw new Error(`No cached response for ${url} and running offline.`);
  }

  const retries = options.retries ?? 3;
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= retries; attempt += 1) {
    await throttle();
    try {
      const response = await fetch(url, {
        headers: { 'User-Agent': USER_AGENT, Accept: 'application/json' },
        signal: AbortSignal.timeout(30_000),
      });

      if (response.status === 429 || response.status >= 500) {
        lastError = new Error(`HTTP ${response.status} for ${url}`);
        const backoff = 2000 * 2 ** attempt;
        console.warn(`  … ${response.status}, backing off ${backoff}ms`);
        await new Promise((resolve) => setTimeout(resolve, backoff));
        continue;
      }

      if (!response.ok) {
        return { data: null as T, cached: false, status: response.status };
      }

      const data = (await response.json()) as T;
      await writeCache(key, { data, status: response.status });
      return { data, cached: false, status: response.status };
    } catch (error) {
      lastError = error as Error;
      await new Promise((resolve) => setTimeout(resolve, 1000 * (attempt + 1)));
    }
  }

  throw lastError ?? new Error(`Failed to fetch ${url}`);
}

export async function fetchBuffer(
  url: string,
  options: FetchOptions = {},
): Promise<{ data: Buffer; status: number; cached: boolean }> {
  await throttle();
  const response = await fetch(url, {
    headers: { 'User-Agent': USER_AGENT },
    signal: AbortSignal.timeout(60_000),
  });

  if (!response.ok) {
    return { data: Buffer.alloc(0), status: response.status, cached: false };
  }

  const data = Buffer.from(await response.arrayBuffer());
  if (options.offline) return { data, status: response.status, cached: false };
  return { data, status: response.status, cached: false };
}

export { USER_AGENT };

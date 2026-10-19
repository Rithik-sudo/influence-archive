import { eq, sql } from 'drizzle-orm';
import { withPrivilegedDb } from '../../src/server/db/tx';
import { sources } from '../../src/server/db/schema';

export type VerifyReport = {
  checked: number;
  ok: number;
  /** The link is refused by the host, usually bot protection. The URL may be fine. */
  blocked: number;
  /** The link is genuinely missing, or the host could not be reached. */
  failed: number;
  failures: { id: string; title: string; url: string; status: number; error?: string }[];
  blocked_list: { id: string; title: string; url: string; status: number }[];
};

const TIMEOUT_MS = 20_000;

/** Status codes that mean "the host refused us", not "the link is dead". */
const BLOCKED_STATUSES = new Set([401, 403, 405, 406, 429, 503]);

/**
 * Checks every source URL and records the result against the source record.
 *
 * Three outcomes are distinguished, because they mean different things:
 *
 *   checked — the link resolved (2xx/3xx).
 *   blocked — the host refused the request (401/403/429 and similar). These
 *             are almost always bot protection in front of a real page, so the
 *             link is recorded as unverified rather than failed.
 *   failed  — the link is missing (404/410) or the host could not be reached.
 *             These are real defects and are listed for fixing.
 *
 * Nothing is deleted automatically.
 */
export async function verifySources(
  options: { only?: string[] } = {},
): Promise<VerifyReport> {
  const report: VerifyReport = {
    checked: 0,
    ok: 0,
    blocked: 0,
    failed: 0,
    failures: [],
    blocked_list: [],
  };

  const rows = await withPrivilegedDb(async (tx) => {
    return tx.select().from(sources);
  });

  for (const source of rows) {
    if (!source.url) {
      await withPrivilegedDb(async (tx) => {
        await tx
          .update(sources)
          .set({ verificationStatus: 'unverified' })
          .where(eq(sources.id, source.id));
      });
      continue;
    }

    if (options.only?.length && !options.only.includes(source.title)) continue;

    report.checked += 1;
    let status = 0;
    let error: string | undefined;

    try {
      const response = await fetch(source.url, {
        method: 'GET',
        redirect: 'follow',
        headers: {
          'User-Agent':
            'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36 InfluenceArchive/0.1',
          Accept: 'text/html,application/xhtml+xml,application/json;q=0.9,*/*;q=0.8',
          'Accept-Language': 'en-GB,en;q=0.9',
        },
        signal: AbortSignal.timeout(TIMEOUT_MS),
      });
      status = response.status;
      await response.arrayBuffer().catch(() => undefined);
    } catch (cause) {
      error = (cause as Error).message;
    }

    const reachable = status >= 200 && status < 400;
    const blocked = BLOCKED_STATUSES.has(status);

    await withPrivilegedDb(async (tx) => {
      await tx
        .update(sources)
        .set({
          verificationStatus: reachable ? 'checked' : blocked ? 'unverified' : 'failed',
          verifiedAt: sql`now()`,
        })
        .where(eq(sources.id, source.id));
    });

    if (reachable) {
      report.ok += 1;
    } else if (blocked) {
      report.blocked += 1;
      report.blocked_list.push({
        id: source.id,
        title: source.title,
        url: source.url,
        status,
      });
    } else {
      report.failed += 1;
      report.failures.push({
        id: source.id,
        title: source.title,
        url: source.url,
        status,
        error,
      });
    }
  }

  return report;
}

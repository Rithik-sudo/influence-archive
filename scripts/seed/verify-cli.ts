#!/usr/bin/env tsx
/**
 * Re-check every source URL in the archive and record the result.
 *
 *   npm run db:verify
 *
 * A source whose link cannot be reached is marked `failed` and listed. Nothing
 * is deleted automatically.
 */
import { closeDb } from '../../src/server/db/tx';
import { verifySources } from './verify';

async function main() {
  console.log('Verifying source links…');
  const report = await verifySources();

  console.log(`  checked ${report.checked}`);
  console.log(`  ok      ${report.ok}`);
  console.log(`  blocked ${report.blocked}  (host refused the request — link may still be fine)`);
  console.log(`  failed  ${report.failed}`);

  if (report.failures.length > 0) {
    console.log('');
    console.log('Unreachable sources:');
    for (const failure of report.failures) {
      console.log(
        `  · ${failure.title}\n      ${failure.url}\n      → ${failure.status || failure.error}`,
      );
    }
    process.exitCode = 1;
  }
}

main()
  .then(async () => {
    await closeDb();
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

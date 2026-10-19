#!/usr/bin/env tsx
/**
 * Seed the archive.
 *
 *   npm run db:seed                 # load everything
 *   npm run db:seed -- --dry-run    # report what would be written
 *   npm run db:seed -- --only ada-lovelace --only alan-turing
 *   npm run db:seed -- --offline    # use cached API responses only
 *   npm run db:seed -- --skip-images
 *
 * The loader is idempotent: records are matched on their slug and updated in
 * place, so running it twice produces the same result. It never deletes
 * anything, and it never touches editor accounts, sessions or settings.
 *
 * The local database is a single-writer PGlite instance, so stop the dev
 * server before running this.
 */
import { closeDb } from '../../src/server/db/tx';
import { loadSeed } from './load';
import { verifySources } from './verify';
import { corpus } from '../../seed/data';

async function main() {
  const args = process.argv.slice(2);

  const only: string[] = [];
  for (let index = 0; index < args.length; index += 1) {
    if (args[index] === '--only') {
      const value = args[index + 1];
      if (value) only.push(value);
      index += 1;
    }
  }

  const options = {
    offline: args.includes('--offline'),
    dryRun: args.includes('--dry-run'),
    skipImages: args.includes('--skip-images'),
    only: only.length > 0 ? only : undefined,
  };

  console.log('Seeding the archive…');
  if (options.only) console.log(`  restricted to: ${options.only.join(', ')}`);

  const report = await loadSeed(corpus, options);

  console.log('');
  console.log('Loaded:');
  console.log(`  people      ${report.people}`);
  console.log(`  articles    ${report.articles}`);
  console.log(`  collections ${report.collections}`);
  console.log(`  categories  ${report.categories}`);
  console.log(`  tags        ${report.tags}`);
  console.log(`  sources     ${report.sources}`);
  console.log(`  portraits   ${report.imagesDownloaded}`);

  if (report.imagesMissing.length > 0) {
    console.log('');
    console.log(`No portrait for ${report.imagesMissing.length} profile(s):`);
    for (const slug of report.imagesMissing) console.log(`  · ${slug}`);
  }

  if (report.warnings.length > 0) {
    console.log('');
    console.log('Warnings:');
    for (const warning of report.warnings) console.log(`  · ${warning}`);
  }

  if (options.dryRun) {
    console.log('');
    console.log('Dry run — nothing was written.');
    return;
  }

  console.log('');
  console.log('Verifying source links…');
  const verification = await verifySources();
  console.log(
    `  checked ${verification.checked}, ok ${verification.ok}, blocked ${verification.blocked}, failed ${verification.failed}`,
  );

  if (verification.failures.length > 0) {
    console.log('');
    console.log('Unreachable sources:');
    for (const failure of verification.failures) {
      console.log(`  · ${failure.title} — ${failure.url} (${failure.status || failure.error})`);
    }
    console.log('');
    console.log('These are recorded as failed, not silently ignored. Fix or remove them.');
  }

  console.log('');
  console.log('Done. Start the site with: npm run dev');

  await closeDb();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

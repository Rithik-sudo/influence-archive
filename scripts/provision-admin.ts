#!/usr/bin/env tsx
/**
 * Provisions the first administrator.
 *
 *   ADMIN_EMAIL=you@example.com ADMIN_PASSWORD='…' npm run db:admin
 *
 * The password is hashed with scrypt before it is stored, and is never
 * printed. The account is marked as needing a password change on first
 * sign-in. Running the script again updates the password for the same
 * address; it never creates a second account for it.
 */
import { eq } from 'drizzle-orm';
import { closeDb, withPrivilegedDb } from '../src/server/db/tx';
import { users } from '../src/server/db/schema';
import { hashPassword, passwordProblems } from '../src/server/auth/password';

async function main() {
  const email = process.env.ADMIN_EMAIL?.trim();
  const password = process.env.ADMIN_PASSWORD ?? '';

  if (!email || !password) {
    console.error('Set both ADMIN_EMAIL and ADMIN_PASSWORD before running this.');
    console.error('  ADMIN_EMAIL=you@example.com ADMIN_PASSWORD="…" npm run db:admin');
    process.exit(1);
  }

  const problems = passwordProblems(password);
  if (problems.length > 0) {
    console.error('The password is too weak:');
    for (const problem of problems) console.error(`  · ${problem}`);
    process.exit(1);
  }

  const passwordHash = await hashPassword(password);

  const existing = await withPrivilegedDb(async (tx) => {
    return tx.select({ id: users.id }).from(users).where(eq(users.email, email)).limit(1);
  });

  await withPrivilegedDb(async (tx) => {
    if (existing[0]) {
      await tx
        .update(users)
        .set({ passwordHash, mustChangePassword: true, updatedAt: new Date() })
        .where(eq(users.id, existing[0].id));
    } else {
      await tx.insert(users).values({
        email,
        passwordHash,
        role: 'admin',
        displayName: email.split('@')[0] ?? 'Editor',
        mustChangePassword: true,
      });
    }
  });

  console.log(
    existing[0]
      ? `Updated the administrator account for ${email}.`
      : `Created the administrator account for ${email}.`,
  );
  console.log('The password must be changed at first sign-in.');

  await closeDb();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

import { eq } from 'drizzle-orm';
import { people } from './src/server/db/schema';
import { withPrivilegedDb } from './src/server/db/tx';
try {
  const r = await withPrivilegedDb(async (tx) => {
    return tx.delete(people).where(eq(people.slug, 'test-subject-for-the-archive-mn4z1k'));
  });
  console.log('deleted rows:', r.rows?.length ?? r.length);
} catch (e) {
  console.log('CLEANUP ERROR:', String(e).slice(0, 400));
}

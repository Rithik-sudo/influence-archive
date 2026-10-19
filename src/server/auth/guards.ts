import 'server-only';
import { redirect } from 'next/navigation';
import { getSessionUser, type SessionUser } from './session';

/**
 * Authorisation for admin pages and mutations.
 *
 * Middleware redirects unauthenticated requests away from /admin for
 * convenience, but this is the boundary that matters: every mutation
 * re-checks the role on the server. Hiding a link is not protection.
 */
export async function requireEditor(): Promise<SessionUser> {
  const user = await getSessionUser();
  if (!user) {
    redirect('/login?next=/admin');
  }
  return user;
}

export async function requireAdmin(): Promise<SessionUser> {
  const user = await requireEditor();
  if (user.role !== 'admin') {
    throw new Error('This action requires an administrator.');
  }
  return user;
}

/** For server actions: returns null instead of redirecting. */
export async function getEditor(): Promise<SessionUser | null> {
  return getSessionUser();
}

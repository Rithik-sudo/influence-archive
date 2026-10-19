import 'server-only';
import { createHash, randomBytes } from 'node:crypto';
import { cookies, headers } from 'next/headers';
import { sql } from 'drizzle-orm';
import { rowsOf, withDb, type EditorIdentity } from '@/server/db/tx';

export const SESSION_COOKIE = 'ia_session';
const SESSION_TTL_SECONDS = 60 * 60 * 12;

export type SessionUser = {
  id: string;
  email: string;
  role: 'admin' | 'editor';
  displayName: string;
  mustChangePassword: boolean;
};

function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

function newToken(): string {
  return randomBytes(32).toString('base64url');
}

/** Creates a session and sets the cookie. The raw token is never stored. */
export async function createSession(userId: string): Promise<void> {
  const token = newToken();
  const tokenHash = hashToken(token);
  const expiresAt = new Date(Date.now() + SESSION_TTL_SECONDS * 1000);

  const headerList = await headers();
  const userAgent = headerList.get('user-agent')?.slice(0, 255) ?? null;

  await withDb(async (tx) => {
    await tx.execute(sql`select app.create_session(${tokenHash}, ${userId}, ${expiresAt.toISOString()}, ${userAgent})`);
  });

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: SESSION_TTL_SECONDS,
  });
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (token) {
    const tokenHash = hashToken(token);
    await withDb(async (tx) => {
      await tx.execute(sql`select app.delete_session(${tokenHash})`);
    });
  }
  cookieStore.delete(SESSION_COOKIE);
}

/** Resolves the session cookie to a user, or null when signed out. */
export async function getSessionUser(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const tokenHash = hashToken(token);

  const rows = await withDb(
    async (tx) => {
      return rowsOf<{
        user_id: string;
        email: string;
        role: 'admin' | 'editor';
        display_name: string;
        must_change_password: boolean;
      }>(
        await tx.execute(sql`select * from app.resolve_session(${tokenHash})`),
      );
    },
    // An explicit identity, so the data-access layer does not try to resolve
    // the session that is currently being resolved.
    {},
  );

  const row = rows[0];
  if (!row) return null;

  return {
    id: row.user_id,
    email: row.email,
    role: row.role,
    displayName: row.display_name,
    mustChangePassword: row.must_change_password,
  };
}

/** The identity to hand to the data-access layer for the current request. */
export async function getEditorIdentity(): Promise<EditorIdentity> {
  const user = await getSessionUser();
  if (!user) return {};
  return { userId: user.id, role: user.role };
}

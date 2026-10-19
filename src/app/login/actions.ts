'use server';

import { redirect } from 'next/navigation';
import { sql } from 'drizzle-orm';
import { rowsOf, withDb } from '@/server/db/tx';
import { verifyPassword } from '@/server/auth/password';
import { createSession, destroySession } from '@/server/auth/session';

export type SignInState = {
  error?: string;
  email?: string;
};

export async function signInAction(
  _prev: SignInState,
  formData: FormData,
): Promise<SignInState> {
  const email = String(formData.get('email') ?? '').trim();
  const password = String(formData.get('password') ?? '');
  const next = String(formData.get('next') ?? '/admin');

  if (!email || !password) {
    return { error: 'Enter both an email address and a password.', email };
  }

  const rows = await withDb(async (tx) => {
    return rowsOf<{
      id: string;
      email: string;
      role: 'admin' | 'editor';
      display_name: string;
      password_hash: string;
      must_change_password: boolean;
    }>(await tx.execute(sql`select * from app.get_user_for_login(${email})`));
  });

  const user = rows[0];

  // The same message for an unknown address and a wrong password, so the form
  // cannot be used to discover which addresses have accounts.
  if (!user || !(await verifyPassword(password, user.password_hash))) {
    return { error: 'Those sign-in details were not recognised.', email };
  }

  await createSession(user.id);

  // Only ever redirect to a path inside this site.
  const destination = next.startsWith('/') && !next.startsWith('//') ? next : '/admin';
  redirect(destination);
}

export async function signOutAction(): Promise<void> {
  await destroySession();
  redirect('/');
}

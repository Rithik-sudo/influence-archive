import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getSessionUser } from '@/server/auth/session';
import { SignInForm } from './SignInForm';

export const metadata: Metadata = {
  title: 'Sign in',
  robots: { index: false, follow: false },
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const user = await getSessionUser();
  if (user) redirect('/admin');

  const { next } = await searchParams;

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-5 py-16">
      <p className="eyebrow">Editorial desk</p>
      <h1 className="mt-3 text-headline text-ink">Sign in</h1>
      <p className="mt-2 text-small text-ink-muted">
        Access is limited to authorised editors. Accounts are provisioned by an administrator;
        there is no public sign-up.
      </p>

      <SignInForm next={next ?? '/admin'} />

      <p className="mt-8 border-t border-rule pt-5 text-[13px] text-ink-faint">
        <Link href="/" className="underline underline-offset-4 hover:text-ink">
          Return to the archive
        </Link>
      </p>
    </div>
  );
}

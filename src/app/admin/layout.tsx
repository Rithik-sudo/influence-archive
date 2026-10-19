import Link from 'next/link';
import { redirect } from 'next/navigation';
import { requireEditor } from '@/server/auth/guards';
import { signOutAction } from '@/app/login/actions';
import { AdminNav } from '@/components/admin/AdminNav';
import { brand } from '@/lib/config';

export const metadata = {
  title: { default: 'Editorial desk', template: '%s — Editorial desk' },
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await requireEditor();
  if (!user) redirect('/login?next=/admin');

  return (
    <div className="flex min-h-dvh flex-col lg:flex-row">
      <a
        href="#admin-main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-[var(--radius-md)] focus:bg-surface focus:px-4 focus:py-2 focus:text-small focus:text-ink"
      >
        Skip to content
      </a>

      <AdminNav displayName={user.displayName} role={user.role} />

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between gap-4 border-b border-rule px-5 py-3 sm:px-8">
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-faint">
            Editorial desk · {user.role}
          </p>
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-[13px] text-ink-muted transition-colors hover:text-accent"
            >
              View the site
            </Link>
            <form action={signOutAction}>
              <button
                type="submit"
                className="text-[13px] text-ink-muted transition-colors hover:text-accent"
              >
                Sign out
              </button>
            </form>
          </div>
        </header>

        <main id="admin-main" className="flex-1 px-5 py-8 sm:px-8">
          <div className="mx-auto max-w-5xl">{children}</div>
        </main>
      </div>
    </div>
  );
}

export { brand };

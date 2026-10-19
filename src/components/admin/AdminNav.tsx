'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  FileText,
  FolderOpen,
  Image as ImageIcon,
  LayoutDashboard,
  Library,
  Settings,
  Tags,
  Users,
} from 'lucide-react';
import { cn } from '@/lib/cn';

const LINKS = [
  { href: '/admin', label: 'Dashboard', Icon: LayoutDashboard, exact: true },
  { href: '/admin/people', label: 'People', Icon: Users },
  { href: '/admin/categories', label: 'Fields', Icon: FolderOpen },
  { href: '/admin/tags', label: 'Tags', Icon: Tags },
  { href: '/admin/collections', label: 'Collections', Icon: Library },
  { href: '/admin/articles', label: 'Essays', Icon: FileText },
  { href: '/admin/sources', label: 'Sources', Icon: Library },
  { href: '/admin/media', label: 'Media', Icon: ImageIcon },
  { href: '/admin/settings', label: 'Settings', Icon: Settings },
];

export function AdminNav({
  displayName,
  role,
}: {
  displayName: string;
  role: string;
}) {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Editorial sections"
      className="border-b border-rule bg-surface lg:w-60 lg:shrink-0 lg:border-b-0 lg:border-r"
    >
      <div className="px-5 py-4 lg:px-6 lg:py-6">
        <Link href="/admin" className="block">
          <span className="block font-display text-[0.95rem] font-semibold tracking-[0.02em] text-ink">
            The Influence Archive
          </span>
          <span className="mt-0.5 block font-mono text-[10.5px] uppercase tracking-[0.14em] text-accent">
            Editorial desk
          </span>
        </Link>
      </div>

      <ul className="flex gap-1 overflow-x-auto px-3 pb-3 lg:flex-col lg:overflow-visible lg:px-3 lg:pb-0">
        {LINKS.map(({ href, label, Icon, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href);
          return (
            <li key={href} className="shrink-0">
              <Link
                href={href}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'flex items-center gap-2.5 rounded-[var(--radius-md)] px-2.5 py-2 text-[13.5px] transition-colors',
                  active
                    ? 'bg-surface-sunken font-medium text-ink'
                    : 'text-ink-muted hover:bg-surface-sunken hover:text-ink',
                )}
              >
                <Icon aria-hidden className="size-4 shrink-0" strokeWidth={1.75} />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>

      <div className="hidden border-t border-rule px-6 py-4 lg:block">
        <p className="text-[13px] text-ink">{displayName}</p>
        <p className="mt-0.5 font-mono text-[10.5px] uppercase tracking-[0.12em] text-ink-faint">
          {role}
        </p>
      </div>
    </nav>
  );
}

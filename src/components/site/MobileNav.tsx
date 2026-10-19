'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { navigation } from '@/lib/config';
import { cn } from '@/lib/cn';

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false);
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, []);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls="mobile-nav"
        className="rounded-[3px] p-1.5 text-ink transition-colors hover:text-accent lg:hidden"
      >
        {open ? (
          <X aria-hidden className="size-5" strokeWidth={1.75} />
        ) : (
          <Menu aria-hidden className="size-5" strokeWidth={1.75} />
        )}
        <span className="sr-only">{open ? 'Close menu' : 'Open menu'}</span>
      </button>

      {open ? (
        <div
          id="mobile-nav"
          className="fixed inset-x-0 top-[57px] z-40 border-b border-rule bg-paper lg:hidden"
        >
          <nav aria-label="Main" className="flex flex-col px-5 py-4">
            {navigation.map((item) => {
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    'border-b border-rule py-3 font-display text-[1.35rem] leading-tight transition-colors',
                    active ? 'text-accent' : 'text-ink hover:text-accent',
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      ) : null}
    </>
  );
}

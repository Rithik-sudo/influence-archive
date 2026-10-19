import Link from 'next/link';
import { navigation } from '@/lib/config';
import { cn } from '@/lib/cn';
import { SearchOverlay } from './SearchOverlay';
import { ThemeToggle } from './ThemeToggle';
import { MobileNav } from './MobileNav';

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-rule bg-paper/92 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-[1440px] items-center gap-5 px-5 sm:px-8">
        <Link
          href="/"
          className="shrink-0 font-display text-[0.95rem] font-semibold tracking-[0.02em] text-ink transition-opacity hover:opacity-70"
        >
          <span className="hidden sm:inline">The Influence </span>
          <span className="sm:hidden">Influence </span>
          <span className="uppercase tracking-[0.14em]">Archive</span>
        </Link>

        <nav aria-label="Main" className="hidden lg:flex lg:items-center lg:gap-7">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'text-[0.9375rem] text-ink-muted transition-colors hover:text-ink',
                'focus-visible:text-ink',
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <SearchOverlay />
          <ThemeToggle />
          <MobileNav />
        </div>
      </div>
    </header>
  );
}

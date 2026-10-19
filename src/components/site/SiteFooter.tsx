import Link from 'next/link';
import { brand, footerSections } from '@/lib/config';

export function SiteFooter() {
  return (
    <footer className="mt-[var(--spacing-section)] border-t border-rule bg-surface">
      <div className="mx-auto max-w-[1440px] px-5 py-14 sm:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2 lg:pr-12">
            <p className="font-display text-[1.05rem] font-semibold tracking-[0.02em] text-ink">
              The Influence Archive
            </p>
            <p className="mt-3 max-w-md text-small text-ink-muted">{brand.tagline}</p>
            <p className="mt-4 max-w-md text-[13px] text-ink-faint">
              An independently curated editorial publication. Every claim carries a source; every
              profile shows its evidence.
            </p>
          </div>

          {footerSections.map((section) => (
            <nav key={section.title} aria-label={section.title}>
              <p className="eyebrow">{section.title}</p>
              <ul className="mt-4 space-y-2.5">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-small text-ink-muted transition-colors hover:text-accent"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-rule pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-[11px] text-ink-faint">
            © {brand.founded} The Influence Archive. Editorial content is published for
            educational purposes.
          </p>
          <p className="font-mono text-[11px] text-ink-faint">
            Portraits and documents remain the property of their rights holders.
          </p>
        </div>
      </div>
    </footer>
  );
}

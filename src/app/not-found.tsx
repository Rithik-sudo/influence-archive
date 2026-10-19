import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-[52ch] flex-col justify-center px-5 py-20">
      <p className="eyebrow">Not found</p>
      <h1 className="mt-3 text-title font-semibold text-ink">This page is not in the archive</h1>
      <p className="mt-4 text-lede leading-relaxed text-ink-muted">
        The address may have changed, or the profile may not have been published. Try the
        directory, or search for the person you were looking for.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href="/explore"
          className="rounded-[var(--radius-md)] bg-accent px-4 py-2 text-small font-medium text-accent-ink transition-colors hover:bg-accent-hover"
        >
          Browse all figures
        </Link>
        <Link
          href="/search"
          className="rounded-[var(--radius-md)] border border-rule px-4 py-2 text-small text-ink transition-colors hover:border-accent hover:text-accent"
        >
          Search the archive
        </Link>
      </div>
    </div>
  );
}

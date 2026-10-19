'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-[52ch] flex-col justify-center px-5 py-20">
      <p className="eyebrow">Something went wrong</p>
      <h1 className="mt-3 text-title font-semibold text-ink">This page could not be loaded</h1>
      <p className="mt-4 text-lede leading-relaxed text-ink-muted">
        The archive hit an unexpected error while assembling this page. Nothing you did caused
        it, and your reading has not been recorded.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={reset}
          className="rounded-[var(--radius-md)] bg-accent px-4 py-2 text-small font-medium text-accent-ink transition-colors hover:bg-accent-hover"
        >
          Try again
        </button>
        <Link
          href="/"
          className="rounded-[var(--radius-md)] border border-rule px-4 py-2 text-small text-ink transition-colors hover:border-accent hover:text-accent"
        >
          Return to the front page
        </Link>
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { Check, Link as LinkIcon, Share2 } from 'lucide-react';

export function ShareButton({ title }: { title: string }) {
  const [state, setState] = useState<'idle' | 'copied' | 'shared'>('idle');

  async function share() {
    const url = window.location.href;

    if (typeof navigator !== 'undefined' && 'share' in navigator) {
      try {
        await navigator.share({ title, url });
        setState('shared');
        window.setTimeout(() => setState('idle'), 2500);
        return;
      } catch {
        // The reader dismissed the share sheet; fall through to copying.
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      setState('copied');
    } catch {
      setState('idle');
    }
    window.setTimeout(() => setState('idle'), 2500);
  }

  return (
    <button
      type="button"
      onClick={share}
      className="inline-flex items-center gap-1.5 rounded-[var(--radius-md)] border border-rule px-3 py-1.5 text-[12.5px] text-ink-muted transition-colors hover:border-rule-strong hover:text-ink"
    >
      {state === 'copied' ? (
        <Check aria-hidden className="size-3.5 text-accent" strokeWidth={2} />
      ) : state === 'shared' ? (
        <Check aria-hidden className="size-3.5 text-accent" strokeWidth={2} />
      ) : (
        <Share2 aria-hidden className="size-3.5" strokeWidth={1.75} />
      )}
      {state === 'copied' ? 'Link copied' : state === 'shared' ? 'Shared' : 'Share'}
      <LinkIcon aria-hidden className="sr-only" />
    </button>
  );
}

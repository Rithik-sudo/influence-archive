'use client';

import { useCallback, useSyncExternalStore } from 'react';
import { Monitor, Moon, Sun } from 'lucide-react';

type Theme = 'light' | 'dark' | 'system';

const COOKIE = 'ia-theme';
const EVENT = 'ia-theme-change';

function readCookie(): Theme {
  if (typeof document === 'undefined') return 'system';
  const value = document.cookie
    .split('; ')
    .find((row) => row.startsWith(`${COOKIE}=`))
    ?.split('=')[1];
  return value === 'light' || value === 'dark' || value === 'system' ? value : 'system';
}

/**
 * The theme is held in a cookie, so it is an external store rather than
 * component state. Reading it with `useSyncExternalStore` keeps the server
 * render and the first client render consistent, and avoids a flash of the
 * wrong appearance.
 */
const serverSnapshot = (): Theme => 'system';

function subscribe(callback: () => void): () => void {
  window.addEventListener(EVENT, callback);
  return () => window.removeEventListener(EVENT, callback);
}

function applyTheme(theme: Theme): void {
  const resolved =
    theme === 'system'
      ? window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light'
      : theme;

  document.documentElement.setAttribute('data-theme', resolved);
  document.cookie = `${COOKIE}=${theme}; path=/; max-age=31536000; samesite=lax`;
  window.dispatchEvent(new Event(EVENT));
}

export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, readCookie, serverSnapshot);

  const options: { value: Theme; label: string; Icon: typeof Sun }[] = [
    { value: 'light', label: 'Light', Icon: Sun },
    { value: 'dark', label: 'Dark', Icon: Moon },
    { value: 'system', label: 'System', Icon: Monitor },
  ];

  const choose = useCallback((next: Theme) => {
    applyTheme(next);
  }, []);

  return (
    <div
      className="flex items-center gap-0.5 rounded-[var(--radius-md)] border border-rule p-0.5"
      role="group"
      aria-label="Colour theme"
    >
      {options.map(({ value, label, Icon }) => (
        <button
          key={value}
          type="button"
          onClick={() => choose(value)}
          aria-pressed={theme === value}
          className={`grid h-7 w-7 place-items-center rounded-[2px] text-ink-faint transition-colors hover:text-ink focus-visible:text-ink ${
            theme === value ? 'bg-surface-sunken text-ink' : ''
          }`}
        >
          <Icon aria-hidden className="size-3.5" strokeWidth={1.75} />
          <span className="sr-only">{label}</span>
        </button>
      ))}
    </div>
  );
}

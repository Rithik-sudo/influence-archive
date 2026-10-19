'use client';

import { useActionState } from 'react';
import { signInAction, type SignInState } from './actions';

const initialState: SignInState = {};

export function SignInForm({ next }: { next: string }) {
  const [state, formAction, pending] = useActionState(signInAction, initialState);

  return (
    <form action={formAction} className="mt-8 space-y-4">
      <input type="hidden" name="next" value={next} />

      {state.error ? (
        <p
          role="alert"
          className="rounded-[var(--radius-md)] border border-accent bg-accent-soft px-3 py-2 text-small text-accent"
        >
          {state.error}
        </p>
      ) : null}

      <div>
        <label htmlFor="email" className="eyebrow block">
          Email address
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="username"
          defaultValue={state.email}
          required
          className="mt-2 h-11 w-full rounded-[var(--radius-md)] border border-rule bg-surface px-3 text-small text-ink outline-none transition-colors focus:border-accent"
        />
      </div>

      <div>
        <label htmlFor="password" className="eyebrow block">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="mt-2 h-11 w-full rounded-[var(--radius-md)] border border-rule bg-surface px-3 text-small text-ink outline-none transition-colors focus:border-accent"
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="h-11 w-full rounded-[var(--radius-md)] bg-accent text-small font-medium text-accent-ink transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? 'Signing in…' : 'Sign in'}
      </button>
    </form>
  );
}

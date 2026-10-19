import { cn } from '@/lib/cn';

export function EmptyState({
  title,
  description,
  action,
  className,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'rounded-[var(--radius-md)] border border-dashed border-rule-strong bg-surface/60 px-6 py-12 text-center',
        className,
      )}
    >
      <p className="font-display text-[1.125rem] font-semibold text-ink">{title}</p>
      {description ? (
        <p className="mx-auto mt-2 max-w-md text-small text-ink-muted">{description}</p>
      ) : null}
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}

export function ErrorState({
  title = 'Something went wrong',
  description,
  action,
  className,
}: {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      role="alert"
      className={cn(
        'rounded-[var(--radius-md)] border border-accent/40 bg-accent-soft px-6 py-10 text-center',
        className,
      )}
    >
      <p className="font-display text-[1.125rem] font-semibold text-accent">{title}</p>
      {description ? (
        <p className="mx-auto mt-2 max-w-md text-small text-ink-muted">{description}</p>
      ) : null}
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn('animate-pulse rounded-[var(--radius-sm)] bg-surface-sunken', className)}
    />
  );
}

export function SkeletonList({ count = 4 }: { count?: number }) {
  return (
    <div className="space-y-4" aria-busy="true" aria-label="Loading">
      {Array.from({ length: count }, (_, index) => (
        <div key={index} className="flex gap-4">
          <Skeleton className="size-20 shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-2/3" />
          </div>
        </div>
      ))}
    </div>
  );
}

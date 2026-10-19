import { cn } from '@/lib/cn';

/** A labelled rule that opens an editorial section. */
export function SectionHeading({
  index,
  title,
  action,
  className,
}: {
  index?: string;
  title: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('flex items-baseline justify-between gap-4 border-t border-rule pt-4', className)}>
      <h2 className="flex items-baseline gap-3 font-display text-[1.375rem] font-semibold text-ink">
        {index ? <span className="eyebrow text-accent">{index}</span> : null}
        {title}
      </h2>
      {action}
    </div>
  );
}

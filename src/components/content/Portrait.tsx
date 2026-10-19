import Image from 'next/image';
import { cn } from '@/lib/cn';
import type { MediaRef } from '@/server/queries/people';

type Props = {
  media: MediaRef | null;
  name: string;
  className?: string;
  imageClassName?: string;
  sizes?: string;
  priority?: boolean;
  /** Rendered above the portrait: name, dates, or nothing. */
  overlay?: React.ReactNode;
};

/**
 * A portrait, with a typographic fallback for people whose image could not be
 * verified. The fallback is deliberately designed rather than a grey box: a
 * monogram on the paper tone, like a catalogue card.
 */
export function Portrait({
  media,
  name,
  className,
  imageClassName,
  sizes = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
  priority = false,
  overlay,
}: Props) {
  if (!media) {
    return (
      <div
        className={cn(
          'relative flex items-end justify-start overflow-hidden bg-surface-sunken',
          className,
        )}
      >
        <span
          aria-hidden
          className="absolute inset-0 grid place-items-center font-display text-[2.75rem] font-semibold leading-none text-sage-deep/45"
        >
          {initials(name)}
        </span>
        {overlay}
      </div>
    );
  }

  return (
    <div className={cn('relative overflow-hidden bg-surface-sunken', className)}>
      <Image
        src={media.url}
        alt={media.altText || name}
        fill
        sizes={sizes}
        priority={priority}
        className={cn('object-cover', imageClassName)}
      />
      {overlay}
    </div>
  );
}

function initials(name: string): string {
  const words = name
    .replace(/\(.*?\)/g, '')
    .split(/\s+/)
    .filter((word) => word.length > 0 && !/^[A-Z]\.$/.test(word));

  if (words.length === 0) return '—';
  if (words.length === 1) return words[0]!.slice(0, 2).toUpperCase();

  const first = words[0]![0] ?? '';
  const last = words[words.length - 1]![0] ?? '';
  return `${first}${last}`.toUpperCase();
}

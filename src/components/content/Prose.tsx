import { renderMarkdown } from '@/lib/content/markdown';
import { cn } from '@/lib/cn';

/**
 * Renders a long-form Markdown field. The HTML is produced by the sanitised
 * pipeline in `src/lib/content/markdown.ts` — raw HTML in the source is
 * dropped, and the output is passed through an allow-list.
 */
export function Prose({
  markdown,
  className,
}: {
  markdown: string | null | undefined;
  className?: string;
}) {
  if (!markdown?.trim()) return null;

  const { html } = renderMarkdown(markdown);

  if (!html) return null;

  return (
    <div
      className={cn('prose', className)}
      // The content has already been through remark → rehype → rehype-sanitize.
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

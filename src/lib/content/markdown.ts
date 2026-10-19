import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkDirective from 'remark-directive';
import remarkRehype from 'remark-rehype';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';
import type { Schema } from 'hast-util-sanitize';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeStringify from 'rehype-stringify';
import { visit } from 'unist-util-visit';
import { toString as hastToString } from 'hast-util-to-string';
import type { Root as MdastRoot, RootContent, BlockContent } from 'mdast';
import type { Root as HastRoot, Element, Properties } from 'hast';

/**
 * Markdown is the storage format for every long-form field.
 *
 * The pipeline is deliberately narrow:
 *   - Raw HTML in the source is dropped (remark-rehype is not given
 *     `allowDangerousHtml`), so an editor cannot inject markup.
 *   - The resulting tree is then passed through rehype-sanitize with an
 *     explicit schema, so even a malformed document cannot escape the
 *     allow-list.
 *   - Two editorial additions are supported: `:::note` callouts and
 *     `{cite ID}` citation markers that link to the source list.
 */

export type TocEntry = {
  id: string;
  text: string;
  level: 2 | 3;
};

const CITATION_PATTERN = /\{cite ([A-Za-z0-9_-]+)\}/;

/** Turns `{cite 3}` into a superscript link to `#source-3`. */
function remarkCitations() {
  return (tree: MdastRoot) => {
    visit(tree, 'text', (node, index, parent) => {
      if (!parent || index === undefined) return;
      // Never nest a link inside a link.
      if (parent.type === 'link') return;
      if (!CITATION_PATTERN.test(node.value)) return;

      const replacement: RootContent[] = [];
      const scanner = new RegExp(CITATION_PATTERN.source, 'g');
      let lastIndex = 0;
      let match: RegExpExecArray | null;

      while ((match = scanner.exec(node.value)) !== null) {
        if (match.index > lastIndex) {
          replacement.push({ type: 'text', value: node.value.slice(lastIndex, match.index) });
        }
        const id = match[1]!;
        replacement.push({
          type: 'link',
          url: `#source-${id}`,
          data: { hProperties: { className: ['citation'] } },
          children: [{ type: 'text', value: id }],
        } as RootContent);
        lastIndex = match.index + match[0].length;
      }
      if (lastIndex < node.value.length) {
        replacement.push({ type: 'text', value: node.value.slice(lastIndex) });
      }

      parent.children.splice(index, 1, ...replacement);
      return index + replacement.length;
    });
  };
}

/** Turns `:::note {title="..."}` into an editorial callout aside. */
function remarkCallouts() {
  return (tree: MdastRoot) => {
    visit(tree, 'containerDirective', (node, index, parent) => {
      if (!parent || index === undefined) return;
      if (node.name !== 'note' && node.name !== 'aside') return;

      const title =
        typeof node.attributes?.title === 'string' ? node.attributes.title : undefined;

      const data = (node.data ?? {}) as {
        hName?: string;
        hProperties?: Properties;
      };
      data.hName = 'aside';
      data.hProperties = { className: ['callout'] };
      node.data = data;

      if (title) {
        node.children.unshift({
          type: 'paragraph',
          data: { hName: 'p', hProperties: { className: ['callout-title'] } },
          children: [{ type: 'text', value: title }],
        } as BlockContent);
      }
    });
  };
}

/**
 * The default schema restricts `className` to footnote classes. Where this
 * publication wants to allow classes, the default entry is removed and
 * replaced with a permissive one — otherwise the first matching entry wins
 * and the classes are silently stripped.
 */
type PropertyDefinition =
  | string
  | [string, ...(string | number | boolean | RegExp | null | undefined)[]];

function withoutClassName(entries: readonly PropertyDefinition[]): PropertyDefinition[] {
  return entries.filter((entry) => {
    const name = typeof entry === 'string' ? entry : entry[0];
    return name !== 'className';
  });
}

/** A single-entry list means "this attribute, with any value". */
const anyClass: PropertyDefinition = ['className'];

const sanitizeSchema = {
  ...defaultSchema,
  tagNames: [
    ...(defaultSchema.tagNames ?? []),
    'aside',
    'figure',
    'figcaption',
    'section',
    'details',
    'summary',
  ],
  attributes: {
    ...defaultSchema.attributes,
    '*': [...withoutClassName(defaultSchema.attributes?.['*'] ?? []), 'id', anyClass],
    a: [
      ...withoutClassName(defaultSchema.attributes?.a ?? []),
      'href',
      'title',
      'id',
      'name',
      anyClass,
    ],
    sup: [anyClass],
    aside: [anyClass],
    p: [anyClass],
    div: [anyClass],
    span: [anyClass],
    section: [anyClass],
    figure: [anyClass],
    figcaption: [anyClass],
    h1: ['id'],
    h2: ['id'],
    h3: ['id'],
    h4: ['id'],
    h5: ['id'],
    h6: ['id'],
    code: [anyClass],
    pre: [anyClass],
    blockquote: [anyClass],
    li: [anyClass],
    td: [anyClass],
    th: [anyClass],
  },
} as unknown as Schema;

export type RenderedMarkdown = {
  html: string;
  toc: TocEntry[];
};

/**
 * Renders Markdown to sanitized HTML and returns the heading outline.
 */
export function renderMarkdown(source: string | null | undefined): RenderedMarkdown {
  const toc: TocEntry[] = [];
  const text = source?.trim();

  if (!text) return { html: '', toc };

  const processor = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkDirective)
    .use(remarkCitations)
    .use(remarkCallouts)
    .use(remarkRehype)
    .use(rehypeSanitize, sanitizeSchema)
    .use(rehypeSlug)
    .use(function collectToc() {
      return (tree: HastRoot) => {
        visit(tree, 'element', (node: Element) => {
          if (node.tagName !== 'h2' && node.tagName !== 'h3') return;
          const id = node.properties?.id;
          if (typeof id !== 'string') return;
          toc.push({
            id,
            text: hastToString(node),
            level: node.tagName === 'h2' ? 2 : 3,
          });
        });
      };
    })
    .use(rehypeAutolinkHeadings, {
      behavior: 'append',
      properties: { className: ['heading-anchor'], ariaHidden: 'true' },
      content: { type: 'text', value: '#' },
    })
    .use(rehypeStringify);

  const file = processor.processSync(text);
  return { html: String(file), toc };
}

/** A plain-text excerpt, used for meta descriptions and search previews. */
export function excerptFrom(source: string | null | undefined, maxLength = 220): string {
  if (!source) return '';
  const plain = source
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/:::[\s\S]*?:::/g, ' ')
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/[*_`>#]/g, '')
    .replace(/\{cite [^}]+\}/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  if (plain.length <= maxLength) return plain;
  const cut = plain.slice(0, maxLength);
  const lastSpace = cut.lastIndexOf(' ');
  return `${(lastSpace > maxLength * 0.6 ? cut.slice(0, lastSpace) : cut).trimEnd()}…`;
}

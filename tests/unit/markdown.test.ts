import { describe, expect, it } from 'vitest';
import { excerptFrom, renderMarkdown } from '@/lib/content/markdown';

describe('renderMarkdown', () => {
  it('renders paragraphs and headings', () => {
    const { html } = renderMarkdown('## A heading\n\nA paragraph.');
    expect(html).toContain('<h2');
    expect(html).toContain('A heading');
    expect(html).toContain('<p>A paragraph.</p>');
  });

  it('drops raw HTML from the source', () => {
    const { html } = renderMarkdown('<script>alert(1)</script>\n\nSafe text.');
    expect(html).not.toContain('<script');
    expect(html).not.toContain('alert(1)');
    expect(html).toContain('Safe text.');
  });

  it('strips javascript: links', () => {
    const { html } = renderMarkdown('[click](javascript:alert(1))');
    expect(html).not.toContain('javascript:');
  });

  it('keeps ordinary links', () => {
    const { html } = renderMarkdown('[docs](https://example.com/docs)');
    expect(html).toContain('href="https://example.com/docs"');
  });

  it('gives headings stable ids for the table of contents', () => {
    const { html, toc } = renderMarkdown('## First heading\n\ntext\n\n### Second heading');
    expect(html).toContain('id="first-heading"');
    expect(toc.map((entry) => entry.text)).toEqual(['First heading', 'Second heading']);
    expect(toc[0]?.level).toBe(2);
    expect(toc[1]?.level).toBe(3);
  });

  it('turns a citation marker into a superscript link', () => {
    const { html } = renderMarkdown('A claim.{cite 1}');
    expect(html).toContain('class="citation"');
    expect(html).toContain('#source-1');
  });

  it('renders a callout as an aside', () => {
    const { html } = renderMarkdown(':::note{title="Careful"}\nA caveat.\n:::');
    expect(html).toContain('<aside');
    expect(html).toContain('callout');
    expect(html).toContain('Careful');
  });

  it('renders GitHub-flavoured tables', () => {
    const { html } = renderMarkdown('| a | b |\n| - | - |\n| 1 | 2 |');
    expect(html).toContain('<table>');
  });

  it('keeps the classes the design system relies on', () => {
    const { html } = renderMarkdown('A claim.{cite 1}');
    expect(html).toContain('class="citation"');
  });

  it('returns nothing for empty input', () => {
    expect(renderMarkdown('')).toEqual({ html: '', toc: [] });
    expect(renderMarkdown(null)).toEqual({ html: '', toc: [] });
  });
});

describe('excerptFrom', () => {
  it('strips markdown syntax', () => {
    expect(excerptFrom('**Bold** and _italic_ text')).toBe('Bold and italic text');
  });

  it('removes citation markers', () => {
    expect(excerptFrom('A claim.{cite 2}')).toBe('A claim.');
  });

  it('truncates with an ellipsis', () => {
    const long = 'word '.repeat(100);
    const excerpt = excerptFrom(long, 50);
    expect(excerpt.length).toBeLessThanOrEqual(51);
    expect(excerpt.endsWith('…')).toBe(true);
  });
});

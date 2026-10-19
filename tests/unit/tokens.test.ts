import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import path from 'node:path';

/**
 * The colour tokens live in `src/styles/globals.css`. This test reads them
 * and checks the contrast ratios that the design depends on.
 */

function readTokens(): Record<string, string> {
  const css = readFileSync(
    path.resolve(import.meta.dirname, '../../src/styles/globals.css'),
    'utf8',
  );

  const rootMatch = /:root\s*\{([\s\S]*?)\}/.exec(css);
  if (!rootMatch) throw new Error('Could not find the :root block in globals.css');

  const tokens: Record<string, string> = {};
  for (const line of rootMatch[1]!.split('\n')) {
    const match = /--([a-z0-9-]+):\s*([^;]+);/.exec(line);
    if (match) tokens[match[1]!] = match[2]!.trim();
  }
  return tokens;
}

function channel(value: number): number {
  const c = value / 255;
  return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}

function luminance(hex: string): number {
  const clean = hex.replace('#', '');
  const r = channel(parseInt(clean.slice(0, 2), 16));
  const g = channel(parseInt(clean.slice(2, 4), 16));
  const b = channel(parseInt(clean.slice(4, 6), 16));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(a: string, b: string): number {
  const l1 = luminance(a);
  const l2 = luminance(b);
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}

const tokens = readTokens();

describe('design tokens', () => {
  it('defines the surfaces and inks it needs', () => {
    for (const key of ['bg', 'surface', 'fg', 'fg-muted', 'rule', 'accent']) {
      expect(tokens[key], `token --${key} is missing`).toMatch(/^#[0-9a-f]{6}$/i);
    }
  });

  it('meets AA for body text on the paper background', () => {
    expect(contrast(tokens.fg!, tokens.bg!)).toBeGreaterThanOrEqual(4.5);
    expect(contrast(tokens['fg-muted']!, tokens.bg!)).toBeGreaterThanOrEqual(4.5);
  });

  it('meets AA for the accent used as text', () => {
    expect(contrast(tokens.accent!, tokens.bg!)).toBeGreaterThanOrEqual(4.5);
  });

  it('meets AA for white text on the accent', () => {
    expect(contrast('#ffffff', tokens.accent!)).toBeGreaterThanOrEqual(4.5);
  });

  it('keeps the sage tone out of the text role, as documented', () => {
    // Sage is a decorative secondary. It is deliberately too light to be used
    // for text on paper, which is why the accent carries that job.
    expect(contrast('#a0b879', tokens.bg!)).toBeLessThan(4.5);
    expect(contrast(tokens['sage-deep']!, tokens.bg!)).toBeGreaterThanOrEqual(4.5);
  });
});

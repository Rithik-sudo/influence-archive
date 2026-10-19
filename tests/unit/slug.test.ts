import { describe, expect, it } from 'vitest';
import { slugify, sortName, uniqueSlug } from '@/lib/slug';

describe('slugify', () => {
  it('lower-cases and hyphenates', () => {
    expect(slugify('Ada Lovelace')).toBe('ada-lovelace');
  });

  it('strips diacritics', () => {
    expect(slugify('Rabindranath Tagore')).toBe('rabindranath-tagore');
    expect(slugify('Frida Kahlo')).toBe('frida-kahlo');
  });

  it('removes apostrophes rather than hyphenating them', () => {
    expect(slugify("Alan Turing's Archive")).toBe('alan-turings-archive');
  });

  it('collapses runs of punctuation', () => {
    expect(slugify('S. R. Ramanujan')).toBe('s-r-ramanujan');
  });

  it('trims leading and trailing hyphens', () => {
    expect(slugify('  --Ada--  ')).toBe('ada');
  });

  it('returns an empty string when there is nothing usable', () => {
    expect(slugify('!!!')).toBe('');
  });
});

describe('sortName', () => {
  it('puts the surname first', () => {
    expect(sortName('Ada Lovelace')).toBe('Lovelace, Ada');
  });

  it('keeps particles with the surname', () => {
    expect(sortName('Albert Einstein')).toBe('Einstein, Albert');
    expect(sortName('Vincent van Gogh')).toBe('van Gogh, Vincent');
  });

  it('leaves a single name alone', () => {
    expect(sortName('Hypatia')).toBe('Hypatia');
  });

  it('does not double-handle an already inverted name', () => {
    expect(sortName('Lovelace, Ada')).toBe('Lovelace, Ada');
  });
});

describe('uniqueSlug', () => {
  it('returns the slug when it is free', () => {
    expect(uniqueSlug('Ada Lovelace', new Set())).toBe('ada-lovelace');
  });

  it('appends a counter when taken', () => {
    expect(uniqueSlug('Ada Lovelace', new Set(['ada-lovelace']))).toBe('ada-lovelace-2');
  });

  it('keeps counting', () => {
    const taken = new Set(['ada-lovelace', 'ada-lovelace-2']);
    expect(uniqueSlug('Ada Lovelace', taken)).toBe('ada-lovelace-3');
  });

  it('falls back when the base is empty', () => {
    expect(uniqueSlug('!!!', new Set())).toBe('untitled');
  });
});

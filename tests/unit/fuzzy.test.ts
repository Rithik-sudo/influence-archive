import { describe, expect, it } from 'vitest';
import { levenshtein, rankByName, scoreName, similarity } from '@/lib/fuzzy';

describe('levenshtein', () => {
  it('is zero for identical strings', () => {
    expect(levenshtein('turing', 'turing')).toBe(0);
  });

  it('counts a substitution', () => {
    expect(levenshtein('turing', 'turiNg')).toBe(1);
  });

  it('counts an insertion', () => {
    expect(levenshtein('turing', 'turings')).toBe(1);
  });

  it('handles an empty string', () => {
    expect(levenshtein('', 'abc')).toBe(3);
    expect(levenshtein('abc', '')).toBe(3);
  });
});

describe('similarity', () => {
  it('is one for identical strings', () => {
    expect(similarity('turing', 'turing')).toBe(1);
  });

  it('is zero for nothing in common', () => {
    expect(similarity('abc', 'xyz')).toBe(0);
  });
});

describe('scoreName', () => {
  it('scores an exact match highest', () => {
    const match = scoreName('ada lovelace', 'Ada Lovelace');
    expect(match.reason).toBe('exact');
    expect(match.score).toBeGreaterThan(80);
  });

  it('scores a prefix highly', () => {
    expect(scoreName('ada', 'Ada Lovelace').reason).toBe('prefix');
  });

  it('finds a surname', () => {
    const match = scoreName('turing', 'Alan Turing');
    expect(match.score).toBeGreaterThan(40);
  });

  it('matches an alternative name', () => {
    const match = scoreName('Augusta Ada King', 'Ada Lovelace', [
      'Augusta Ada King, Countess of Lovelace',
    ]);
    expect(match.reason).toBe('alias');
    expect(match.score).toBeGreaterThan(60);
  });

  it('tolerates a typo', () => {
    const match = scoreName('ramanj', 'Srinivasa Ramanujan');
    expect(match.reason).toBe('fuzzy');
    expect(match.score).toBeGreaterThan(0);
  });

  it('returns nothing for an unrelated name', () => {
    expect(scoreName('zzzzzz', 'Ada Lovelace').score).toBe(0);
  });
});

describe('rankByName', () => {
  it('orders by score and drops non-matches', () => {
    const ranked = rankByName('ada', [
      { name: 'Alan Turing', aliases: [] },
      { name: 'Ada Lovelace', aliases: [] },
      { name: 'Grace Hopper', aliases: [] },
    ]);

    expect(ranked).toHaveLength(1);
    expect(ranked[0]?.item.name).toBe('Ada Lovelace');
  });
});

/**
 * Fuzzy name matching, done in the application rather than in the database.
 *
 * The obvious alternative is the `pg_trgm` extension, but its similarity
 * functions are not available on every managed Postgres, and the extension
 * bundle could not be loaded inside a bundled Next.js build. Scoring in
 * TypeScript keeps the schema portable and gives us direct control over how
 * a name match is ranked.
 */

/** Levenshtein edit distance, with an early exit for very different lengths. */
export function levenshtein(a: string, b: string): number {
  if (a === b) return 0;
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  if (Math.abs(a.length - b.length) > 3) {
    return Math.max(a.length, b.length);
  }

  let previous = new Array<number>(b.length + 1);
  let current = new Array<number>(b.length + 1);

  for (let j = 0; j <= b.length; j += 1) previous[j] = j;

  for (let i = 1; i <= a.length; i += 1) {
    current[0] = i;
    const aChar = a.charCodeAt(i - 1);

    for (let j = 1; j <= b.length; j += 1) {
      const cost = aChar === b.charCodeAt(j - 1) ? 0 : 1;
      current[j] = Math.min(
        (current[j - 1] ?? 0) + 1, // insertion
        (previous[j] ?? 0) + 1, // deletion
        (previous[j - 1] ?? 0) + cost, // substitution
      );
    }

    const swap = previous;
    previous = current;
    current = swap;
  }

  return previous[b.length] ?? 0;
}

/** 1.0 for identical strings, 0.0 for nothing in common. */
export function similarity(a: string, b: string): number {
  if (a === b) return 1;
  const longest = Math.max(a.length, b.length);
  if (longest === 0) return 1;
  return 1 - levenshtein(a, b) / longest;
}

function normalise(value: string): string {
  return value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export type NameMatch = {
  score: number;
  reason: 'exact' | 'prefix' | 'contains' | 'alias' | 'fuzzy' | 'none';
};

/**
 * Scores how well a query matches a person, considering their full name and
 * any alternative names.
 */
export function scoreName(query: string, name: string, aliases: string[] = []): NameMatch {
  const q = normalise(query);
  const n = normalise(name);
  if (!q || !n) return { score: 0, reason: 'none' };

  if (n === q) return { score: 100, reason: 'exact' };
  if (n.startsWith(q)) return { score: 80, reason: 'prefix' };
  if (n.includes(q)) return { score: 60, reason: 'contains' };

  // Any individual word of the name starting with the query.
  const words = n.split(' ').filter(Boolean);
  if (words.some((word) => word.startsWith(q))) {
    return { score: 55, reason: 'prefix' };
  }

  // Surname match: "Turing" should find "Alan Turing".
  const surname = words.length > 1 ? words[words.length - 1] : undefined;
  if (surname && surname.startsWith(q)) {
    return { score: 50, reason: 'prefix' };
  }

  for (const alias of aliases) {
    const a = normalise(alias);
    if (!a) continue;
    if (a === q) return { score: 90, reason: 'alias' };
    if (a.startsWith(q)) return { score: 70, reason: 'alias' };
    if (a.includes(q)) return { score: 55, reason: 'alias' };
  }

  // Typo tolerance.
  const candidates = [n, ...aliases.map(normalise)];
  let best = 0;
  for (const candidate of candidates) {
    best = Math.max(best, similarity(q, candidate));

    // Compare against each word as well, so "ramanj" finds "Ramanujan".
    for (const word of candidate.split(' ').filter(Boolean)) {
      best = Math.max(best, similarity(q, word));
    }
  }

  if (best >= 0.6) {
    return { score: Math.round(best * 45), reason: 'fuzzy' };
  }

  return { score: 0, reason: 'none' };
}

/**
 * Ranks a list of candidates against a query. Higher is better; zero means
 * "not a match".
 */
export function rankByName<T extends { name: string; aliases: string[] }>(
  query: string,
  candidates: T[],
): { item: T; score: number }[] {
  return candidates
    .map((item) => ({ item, score: scoreName(query, item.name, item.aliases).score }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score);
}

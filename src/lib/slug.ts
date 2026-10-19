/**
 * Slug helpers. Kept dependency-free so they can be unit tested and reused by
 * the seed scripts.
 */

/** Characters that are meaningful in a URL and must not appear in a slug. */
export function slugify(input: string): string {
  return input
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 96)
    .replace(/-+$/g, '');
}

/**
 * A stable, readable sort key for a person's name.
 * "Ada Lovelace" -> "Lovelace, Ada"
 */
export function sortName(fullName: string): string {
  const trimmed = fullName.trim();
  const commaIndex = trimmed.indexOf(',');
  if (commaIndex > 0) return trimmed;

  const particles = ['van', 'von', 'de', 'del', 'della', 'der', 'den', 'da', 'di', 'du', 'al'];
  const parts = trimmed.split(/\s+/);
  if (parts.length < 2) return trimmed;

  let splitAt = parts.length - 1;
  while (splitAt > 1 && particles.includes(parts[splitAt - 1]!.toLowerCase())) {
    splitAt -= 1;
  }

  const surname = parts.slice(splitAt).join(' ');
  const given = parts.slice(0, splitAt).join(' ');
  return `${surname}, ${given}`;
}

/**
 * Compares two slugs for uniqueness, treating a trailing numeric suffix as
 * meaningful. Returns the slug unchanged when it is free.
 */
export function uniqueSlug(base: string, taken: Set<string>): string {
  const root = slugify(base) || 'untitled';
  if (!taken.has(root)) return root;

  let counter = 2;
  let candidate = `${root}-${counter}`;
  while (taken.has(candidate)) {
    counter += 1;
    candidate = `${root}-${counter}`;
  }
  return candidate;
}

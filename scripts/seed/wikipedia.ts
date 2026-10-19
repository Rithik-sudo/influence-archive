import { fetchJson } from './http';

/**
 * Wikipedia is used for two things: the infobox facts (dates, occupation,
 * nationality, portrait file) and the lead paragraph, which gives a
 * cross-checkable summary of who someone was.
 *
 * Nothing is invented here — this only reads what Wikipedia publishes.
 */

export type WikipediaFacts = {
  pageId: number;
  title: string;
  revisionId: number;
  wikidataId: string | null;
  fields: Record<string, string>;
  lead: string;
  imageFile: string | null;
  url: string;
};

type WikiQueryResponse = {
  query?: {
    pages?: {
      pageid?: number;
      title?: string;
      missing?: string;
      pageprops?: { wikibase_item?: string };
      revisions?: {
        revid?: number;
        slots?: { main?: { content?: string } };
      }[];
    }[];
  };
};

/** Extracts a value from wikitext infobox parameters. */
function readInfoboxField(wikitext: string, field: string): string | null {
  const pattern = new RegExp(`\\|\\s*${field}\\s*=([^\\n|]*)`, 'i');
  const match = pattern.exec(wikitext);
  if (!match) return null;

  const raw = (match[1] ?? '').trim();
  if (!raw) return null;

  // Strip wiki links, templates and references, keeping the display text.
  const cleaned = raw
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/\[\[[^\]|]*\|([^\]]*)\]\]/g, '$1')
    .replace(/\[\[([^\]]*)\]\]/g, '$1')
    .replace(/<ref[^>]*\/>/gi, '')
    .replace(/<ref[^>]*>[\s\S]*?<\/ref>/gi, '')
    .replace(/\{\{[^{}]*\}\}/g, '')
    .replace(/'''?/g, '')
    .trim();

  return cleaned || null;
}

function readLead(wikitext: string): string {
  const withoutComments = wikitext
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/\{\{[^{}]*\}\}/g, '');

  const paragraphs = withoutComments
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  for (const paragraph of paragraphs) {
    if (paragraph.startsWith('=')) continue;
    if (paragraph.startsWith('{{') || paragraph.startsWith('[[File:')) continue;
    if (paragraph.startsWith('*') || paragraph.startsWith(';')) continue;

    const plain = paragraph
      .replace(/\[\[[^\]|]*\|([^\]]*)\]\]/g, '$1')
      .replace(/\[\[([^\]]*)\]\]/g, '$1')
      .replace(/<ref[^>]*\/>/gi, '')
      .replace(/<ref[^>]*>[\s\S]*?<\/ref>/gi, '')
      .replace(/'''?/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    if (plain.length > 60) return plain;
  }

  return '';
}

/**
 * Falls back to the article's lead image when the infobox has no `image`
 * parameter. Some biographies use a photo caption or a different template, and
 * a few have no infobox image at all.
 */
async function fetchLeadImage(
  title: string,
  options: { offline?: boolean } = {},
): Promise<string | null> {
  const url =
    'https://en.wikipedia.org/w/api.php?action=query&prop=pageimages&piprop=name' +
    `&titles=${encodeURIComponent(title)}&format=json&formatversion=2`;

  try {
    const { data } = await fetchJson<{
      query?: { pages?: { title?: string; pageimage?: string }[] };
    }>(url, { offline: options.offline });

    return data.query?.pages?.[0]?.pageimage ?? null;
  } catch {
    return null;
  }
}

export async function fetchWikipediaFacts(
  title: string,
  options: { offline?: boolean } = {},
): Promise<WikipediaFacts> {
  const url =
    'https://en.wikipedia.org/w/api.php?action=query&prop=revisions|pageprops&rvprop=content' +
    `&rvslots=main&titles=${encodeURIComponent(title)}&format=json&formatversion=2`;

  const { data } = await fetchJson<WikiQueryResponse>(url, { offline: options.offline });
  const page = data.query?.pages?.[0];

  if (!page || page.missing !== undefined) {
    throw new Error(`Wikipedia article not found: ${title}`);
  }

  const wikitext = page.revisions?.[0]?.slots?.main?.content ?? '';

  const fields: Record<string, string> = {};
  for (const field of [
    'birth_date',
    'death_date',
    'birth_date1',
    'death_date1',
    'occupation',
    'occupation1',
    'nationality',
    'known_for',
    'years_active',
    'citizenship',
    'movement',
    'notable_works',
    'awards',
    'resting_place',
  ]) {
    const value = readInfoboxField(wikitext, field);
    if (value) fields[field] = value;
  }

  const imageFile = readInfoboxField(wikitext, 'image');

  return {
    pageId: page.pageid ?? 0,
    title: page.title ?? title,
    revisionId: page.revisions?.[0]?.revid ?? 0,
    wikidataId: page.pageprops?.wikibase_item ?? null,
    fields,
    lead: readLead(wikitext),
    imageFile: imageFile
      ? imageFile.replace(/^File:/i, '').trim()
      : await fetchLeadImage(page.title ?? title, options),
    url: `https://en.wikipedia.org/wiki/${encodeURIComponent(page.title ?? title)}`,
  };
}

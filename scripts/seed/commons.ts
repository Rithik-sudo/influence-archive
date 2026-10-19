import { fetchJson } from './http';

/**
 * Wikimedia Commons holds the file, its licence, the maker and the holding
 * institution. All four are stored against the media record so that every
 * image in the archive carries its own attribution.
 */

export type CommonsFile = {
  title: string;
  url: string;
  descriptionUrl: string;
  licenseName: string | null;
  licenseUrl: string | null;
  artist: string | null;
  credit: string | null;
  usageTerms: string | null;
  description: string | null;
  width: number | null;
  height: number | null;
  mimeType: string | null;
  /** A scaled copy of the file at the requested width. */
  thumbUrl: string;
};

type CommonsResponse = {
  query?: {
    pages?: {
      title?: string;
      missing?: string;
      imageinfo?: {
        url?: string;
        descriptionurl?: string;
        extmetadata?: Record<string, { value?: string }>;
        width?: number;
        height?: number;
        mime?: string;
        thumburl?: string;
        thumbwidth?: number;
      }[];
    }[];
  };
};

function stripHtml(value: string | undefined): string | null {
  if (!value) return null;
  const text = value
    .replace(/<[^>]*>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return text || null;
}

export async function fetchCommonsFile(
  fileName: string,
  options: { offline?: boolean; width?: number } = {},
): Promise<CommonsFile | null> {
  const title = fileName.startsWith('File:') ? fileName : `File:${fileName}`;
  const width = options.width ?? 1200;

  const url =
    'https://commons.wikimedia.org/w/api.php?action=query&prop=imageinfo' +
    `&iiprop=url|extmetadata|size|mime&iiurlwidth=${width}` +
    `&titles=${encodeURIComponent(title)}&format=json&formatversion=2`;

  const { data } = await fetchJson<CommonsResponse>(url, { offline: options.offline });
  const page = data.query?.pages?.[0];

  if (!page || page.missing !== undefined) return null;

  const info = page.imageinfo?.[0];
  if (!info) return null;

  const meta = info.extmetadata ?? {};

  return {
    title: page.title ?? title,
    url: info.url ?? '',
    descriptionUrl: info.descriptionurl ?? `https://commons.wikimedia.org/wiki/${encodeURIComponent(title)}`,
    licenseName: stripHtml(meta.LicenseShortName?.value) ?? stripHtml(meta.UsageTerms?.value),
    licenseUrl: stripHtml(meta.LicenseUrl?.value),
    artist: stripHtml(meta.Artist?.value),
    credit: stripHtml(meta.Credit?.value),
    usageTerms: stripHtml(meta.UsageTerms?.value),
    description: stripHtml(meta.ImageDescription?.value),
    width: info.width ?? null,
    height: info.height ?? null,
    mimeType: info.mime ?? null,
    thumbUrl:
      info.thumburl ??
      `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(fileName)}?width=${width}`,
  };
}

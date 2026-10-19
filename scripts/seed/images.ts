import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fetchBuffer } from './http';
import type { CommonsFile } from './commons';

const MEDIA_ROOT = path.resolve(process.cwd(), process.env.MEDIA_ROOT ?? 'media');

export type StoredImage = {
  /** Path relative to MEDIA_ROOT. */
  relativePath: string;
  bytes: number;
  width: number | null;
  height: number | null;
};

const EXTENSION_BY_MIME: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/tiff': 'tif',
  'image/svg+xml': 'svg',
};

/**
 * Downloads a portrait into the local media library.
 *
 * Nothing is hotlinked: the file is stored here and served by the app, so a
 * reader's request never reaches a third-party server. The licence, maker and
 * credit are recorded separately against the media record.
 */
export async function downloadPortrait(
  file: CommonsFile,
  slug: string,
  options: { offline?: boolean } = {},
): Promise<StoredImage | null> {
  const extension = EXTENSION_BY_MIME[file.mimeType ?? ''] ?? 'jpg';
  const relativePath = path.join('people', `${slug}.${extension}`);
  const absolutePath = path.join(MEDIA_ROOT, relativePath);

  await mkdir(path.dirname(absolutePath), { recursive: true });

  const { data, status } = await fetchBuffer(file.thumbUrl, { offline: options.offline });

  if (status !== 200 || data.length === 0) {
    return null;
  }

  await writeFile(absolutePath, data);

  return {
    relativePath: relativePath.split(path.sep).join('/'),
    bytes: data.length,
    width: file.width,
    height: file.height,
  };
}

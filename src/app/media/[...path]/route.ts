import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import path from 'node:path';
import { Readable } from 'node:stream';
import { NextResponse } from 'next/server';

const MEDIA_ROOT = path.join(process.cwd(), process.env.MEDIA_ROOT ?? 'media');

const CONTENT_TYPES: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.pdf': 'application/pdf',
};

/**
 * Serves the media library from disk.
 *
 * Only files inside MEDIA_ROOT can be read: the requested path is resolved and
 * then checked to be a child of the root, so `../` cannot escape it.
 */
export async function GET(
  _request: Request,
  context: { params: Promise<{ path: string[] }> },
) {
  const { path: segments } = await context.params;

  const requested = segments.map((segment) => decodeURIComponent(segment)).join('/');
  const resolved = path.join(MEDIA_ROOT, requested);

  if (resolved !== MEDIA_ROOT && !resolved.startsWith(`${MEDIA_ROOT}${path.sep}`)) {
    return new NextResponse('Not found', { status: 404 });
  }

  try {
    const stats = await stat(resolved);
    if (!stats.isFile()) {
      return new NextResponse('Not found', { status: 404 });
    }

    const extension = path.extname(resolved).toLowerCase();
    const contentType = CONTENT_TYPES[extension] ?? 'application/octet-stream';
    const stream = Readable.toWeb(createReadStream(resolved)) as ReadableStream;

    return new NextResponse(stream, {
      headers: {
        'Content-Type': contentType,
        'Content-Length': String(stats.size),
        'Cache-Control': 'public, max-age=31536000, immutable',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch {
    return new NextResponse('Not found', { status: 404 });
  }
}

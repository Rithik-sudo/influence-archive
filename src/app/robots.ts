import type { MetadataRoute } from 'next';
import { headers } from 'next/headers';

export default async function robots(): Promise<MetadataRoute.Robots> {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  let base = configured?.replace(/\/$/, '');

  if (!base) {
    try {
      const headerList = await headers();
      const host = headerList.get('x-forwarded-host') ?? headerList.get('host');
      if (host) {
        const proto =
          headerList.get('x-forwarded-proto') ??
          (host.startsWith('localhost') || host.startsWith('127.') ? 'http' : 'https');
        base = `${proto}://${host}`;
      }
    } catch {
      // No request context: fall through.
    }
  }

  base ??= 'http://localhost:3000';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/admin/', '/login', '/api/', '/search'],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}

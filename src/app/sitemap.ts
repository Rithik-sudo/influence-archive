import type { MetadataRoute } from 'next';
import { headers } from 'next/headers';
import { listPeople } from '@/server/queries/people';
import { listCategories } from '@/server/queries/categories';
import { listCollections } from '@/server/queries/collections';
import { listArticles } from '@/server/queries/articles';

export const dynamic = 'force-dynamic';

async function resolveBase(): Promise<string> {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (configured) return configured.replace(/\/$/, '');

  try {
    const headerList = await headers();
    const host = headerList.get('x-forwarded-host') ?? headerList.get('host');
    if (host) {
      const proto =
        headerList.get('x-forwarded-proto') ??
        (host.startsWith('localhost') || host.startsWith('127.') ? 'http' : 'https');
      return `${proto}://${host}`;
    }
  } catch {
    // No request context: fall through.
  }

  return 'http://localhost:3000';
}

/**
 * Only published, canonical URLs are listed. Filtered views of the directory
 * are deliberately excluded so that every combination of query parameters does
 * not become a separate index entry.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const BASE = await resolveBase();

  const [people, categories, collections, articles] = await Promise.all([
    listPeople({ perPage: 60, page: 1, sort: 'alpha' }),
    listCategories(),
    listCollections(),
    listArticles(200),
  ]);

  const pages: { path: string; priority: number; changeFrequency: 'daily' | 'weekly' | 'monthly' }[] =
    [
      { path: '/', priority: 1, changeFrequency: 'daily' },
      { path: '/explore', priority: 0.9, changeFrequency: 'daily' },
      { path: '/categories', priority: 0.8, changeFrequency: 'weekly' },
      { path: '/collections', priority: 0.8, changeFrequency: 'weekly' },
      { path: '/articles', priority: 0.8, changeFrequency: 'weekly' },
      { path: '/about', priority: 0.5, changeFrequency: 'monthly' },
      { path: '/editorial-standards', priority: 0.4, changeFrequency: 'monthly' },
      { path: '/privacy', priority: 0.3, changeFrequency: 'monthly' },
      { path: '/terms', priority: 0.3, changeFrequency: 'monthly' },
    ];

  return [
    ...pages.map((page) => ({
      url: `${BASE}${page.path}`,
      lastModified: new Date(),
      changeFrequency: page.changeFrequency,
      priority: page.priority,
    })),
    ...people.items.map((person) => ({
      url: `${BASE}/people/${person.slug}`,
      lastModified: person.publishedAt ?? new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
    ...categories.map((category) => ({
      url: `${BASE}/categories/${category.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    })),
    ...collections.map((collection) => ({
      url: `${BASE}/collections/${collection.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    })),
    ...articles.map((article) => ({
      url: `${BASE}/articles/${article.slug}`,
      lastModified: article.publishedAt ?? new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
  ];
}

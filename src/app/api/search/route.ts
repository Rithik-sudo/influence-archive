import { NextResponse } from 'next/server';
import { searchAll } from '@/server/queries/search';

/**
 * Typeahead for the search overlay.
 *
 * Runs under the anonymous role, so row level security means only published
 * content can ever appear here — a draft profile is not merely filtered out,
 * it is not visible to the query.
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const query = url.searchParams.get('q') ?? '';

  if (query.trim().length < 2) {
    return NextResponse.json(
      { query: query.trim(), people: [], articles: [], collections: [], total: 0 },
      { headers: { 'Cache-Control': 'no-store' } },
    );
  }

  try {
    const results = await searchAll(query, 6);
    return NextResponse.json(results, {
      headers: { 'Cache-Control': 'private, max-age=30' },
    });
  } catch (error) {
    console.error('Search failed', error);
    return NextResponse.json(
      { error: 'Search is unavailable.' },
      { status: 503 },
    );
  }
}

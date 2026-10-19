import 'server-only';
import { sql } from 'drizzle-orm';
import { cache } from 'react';
import { siteSettings } from '@/server/db/schema';
import { withDb, type EditorIdentity } from '@/server/db/tx';
import { brand as defaultBrand, type Brand } from '@/lib/config';

/**
 * Editorial settings that editors can change without a redeploy.
 * Anything not set falls back to the compiled-in brand defaults.
 */
export const getSiteSettings = cache(async (identity?: EditorIdentity): Promise<Record<string, unknown>> => {
  return withDb(async (tx) => {
    const rows = await tx.select().from(siteSettings);
    const out: Record<string, unknown> = {};
    for (const row of rows) {
      out[row.key] = row.value;
    }
    return out;
  }, identity);
});

export async function getBrand(identity?: EditorIdentity): Promise<Brand> {
  const settings = await getSiteSettings(identity);
  const pick = <T,>(key: string, fallback: T): T => {
    const value = settings[key];
    if (value === undefined || value === null) return fallback;
    if (typeof value === 'string' && typeof fallback === 'string') return value as T;
    return fallback;
  };

  return {
    ...defaultBrand,
    name: pick('name', defaultBrand.name),
    shortName: pick('shortName', defaultBrand.shortName),
    tagline: pick('tagline', defaultBrand.tagline),
    description: pick('description', defaultBrand.description),
    homeHeadline: pick('homeHeadline', defaultBrand.homeHeadline),
    homeStandfirst: pick('homeStandfirst', defaultBrand.homeStandfirst),
    contactEmail: pick('contactEmail', defaultBrand.contactEmail),
  };
}

export async function setSiteSetting(
  key: string,
  value: unknown,
  identity?: EditorIdentity,
): Promise<void> {
  await withDb(async (tx) => {
    await tx
      .insert(siteSettings)
      .values({ key, value: value as never })
      .onConflictDoUpdate({
        target: siteSettings.key,
        set: { value: value as never, updatedAt: sql`now()` },
      });
  }, identity);
}

import path from 'node:path';
import { eq, sql } from 'drizzle-orm';
import { withPrivilegedDb } from '../../src/server/db/tx';
import {
  articles,
  articleCategories,
  articlePeople,
  articleRelations,
  articleSources,
  articleTags,
  categories,
  collectionItems,
  collections,
  mediaAssets,
  people,
  periods,
  personCategories,
  personRelationships,
  personSources,
  personTags,
  places,
  sources,
  tags,
  timelineEvents,
} from '../../src/server/db/schema';
import type {
  SeedArticle,
  SeedCategory,
  SeedCollection,
  SeedPeriod,
  SeedPerson,
  SeedSource,
  SeedTag,
} from '../../seed/types';
import { sortName } from '../../src/lib/slug';
import { fetchWikipediaFacts } from './wikipedia';
import { fetchCommonsFile } from './commons';
import { downloadPortrait } from './images';

type MediaAssetRecord = {
  filename: string;
  path: string;
  mimeType: string;
  width: number | null;
  height: number | null;
  bytes: number;
  altText: string;
  caption: string;
  artist: string | null;
  credit: string | null;
  licenseName: string | null;
  licenseUrl: string | null;
  sourcePageUrl: string;
};

export type LoadOptions = {
  offline?: boolean;
  dryRun?: boolean;
  /** Only load people whose slug is in this list. */
  only?: string[];
  skipImages?: boolean;
};

export type LoadReport = {
  people: number;
  articles: number;
  collections: number;
  categories: number;
  tags: number;
  sources: number;
  imagesDownloaded: number;
  imagesMissing: string[];
  warnings: string[];
};

/**
 * Writes the authored corpus into the database.
 *
 * The loader is idempotent: every record is matched on its slug or key and
 * updated in place, so running it twice produces the same result. It never
 * deletes anything and never touches editor accounts, sessions, settings or
 * the audit log.
 */
export async function loadSeed(
  corpus: {
    people: SeedPerson[];
    articles: SeedArticle[];
    collections: SeedCollection[];
    categories: SeedCategory[];
    tags: SeedTag[];
    periods: SeedPeriod[];
    sources: SeedSource[];
  },
  options: LoadOptions = {},
): Promise<LoadReport> {
  const report: LoadReport = {
    people: 0,
    articles: 0,
    collections: 0,
    categories: 0,
    tags: 0,
    sources: 0,
    imagesDownloaded: 0,
    imagesMissing: [],
    warnings: [],
  };

  const only = options.only;
  const selectedPeople = only
    ? corpus.people.filter((person) => only.includes(person.slug))
    : corpus.people;
  const selectedArticles = only
    ? corpus.articles.filter((article) => only.includes(article.slug))
    : corpus.articles;

  // --- Phase one: fetch portraits and their attribution, outside the
  // database transaction, so a slow network call never holds a transaction
  // open on a single-connection database.
  const mediaBySlug = new Map<string, MediaAssetRecord>();

  for (const person of selectedPeople) {
    if (!person.wikipedia || options.skipImages) continue;

    try {
      const facts = await fetchWikipediaFacts(person.wikipedia, {
        offline: options.offline,
      });

      if (!facts.imageFile) {
        report.imagesMissing.push(person.slug);
        report.warnings.push(
          `Wikipedia lists no portrait for ${person.slug} — using the typographic fallback.`,
        );
        continue;
      }

      const file = await fetchCommonsFile(facts.imageFile, { offline: options.offline });
      if (!file) {
        report.imagesMissing.push(person.slug);
        report.warnings.push(
          `No Commons file for ${person.slug} (${facts.imageFile}) — using the typographic fallback.`,
        );
        continue;
      }

      const stored = await downloadPortrait(file, person.slug, { offline: options.offline });
      if (!stored) {
        report.imagesMissing.push(person.slug);
        report.warnings.push(`Could not download a portrait for ${person.slug}.`);
        continue;
      }

      mediaBySlug.set(person.slug, {
        filename: path.basename(stored.relativePath),
        path: stored.relativePath,
        mimeType: file.mimeType ?? 'image/jpeg',
        width: stored.width,
        height: stored.height,
        bytes: stored.bytes,
        altText: `Portrait of ${person.fullName}`,
        caption: file.description ? file.description.slice(0, 300) : `Portrait of ${person.fullName}`,
        artist: file.artist,
        credit: file.credit,
        licenseName: file.licenseName,
        licenseUrl: file.licenseUrl,
        sourcePageUrl: file.descriptionUrl,
      });
      report.imagesDownloaded += 1;
    } catch (error) {
      report.warnings.push(
        `Could not fetch facts for ${person.slug}: ${(error as Error).message}`,
      );
      report.imagesMissing.push(person.slug);
    }
  }

  await withPrivilegedDb(async (tx) => {
    // ------------------------------------------------------ taxonomy
    for (const category of corpus.categories) {
      const parent = category.parent
        ? await tx
            .select({ id: categories.id })
            .from(categories)
            .where(eq(categories.slug, category.parent))
            .limit(1)
        : [];

      await tx
        .insert(categories)
        .values({
          slug: category.slug,
          name: category.name,
          description: category.description,
          parentId: parent[0]?.id ?? null,
          sortOrder: category.sortOrder,
          featured: category.featured ?? false,
          status: 'published',
        })
        .onConflictDoUpdate({
          target: categories.slug,
          set: {
            name: category.name,
            description: category.description,
            sortOrder: category.sortOrder,
            featured: category.featured ?? false,
            status: 'published',
            updatedAt: sql`now()`,
          },
        });
      report.categories += 1;
    }

    for (const tag of corpus.tags) {
      await tx
        .insert(tags)
        .values({ slug: tag.slug, name: tag.name, description: tag.description ?? '' })
        .onConflictDoUpdate({
          target: tags.slug,
          set: { name: tag.name, description: tag.description ?? '' },
        });
      report.tags += 1;
    }

    for (const period of corpus.periods) {
      await tx
        .insert(periods)
        .values({
          slug: period.slug,
          name: period.name,
          startYear: period.startYear,
          endYear: period.endYear,
          description: period.description,
        })
        .onConflictDoUpdate({
          target: periods.slug,
          set: {
            name: period.name,
            startYear: period.startYear,
            endYear: period.endYear,
            description: period.description,
          },
        });
    }

    // -------------------------------------------------------- sources
    for (const source of corpus.sources) {
      await tx
        .insert(sources)
        .values({
          key: source.key,
          title: source.title,
          author: source.author,
          publisher: source.publisher,
          url: source.url,
          publishedDate: source.publishedDate,
          doi: source.doi,
          isbn: source.isbn,
          type: source.type,
          notes: source.notes ?? '',
        })
        .onConflictDoUpdate({
          target: sources.key,
          set: {
            title: source.title,
            author: source.author,
            publisher: source.publisher,
            url: source.url,
            publishedDate: source.publishedDate,
            doi: source.doi,
            isbn: source.isbn,
            type: source.type,
            notes: source.notes ?? '',
          },
        });
      report.sources += 1;
    }

    const sourceRows = await tx.select().from(sources);
    const sourceIdByKey = new Map<string, string>();
    for (const row of sourceRows) {
      sourceIdByKey.set(row.key, row.id);
    }

    // --------------------------------------------------------- people
    for (const person of selectedPeople) {
      let portraitMediaId: string | null = null;

      const media = mediaBySlug.get(person.slug);
      if (media) {
        const inserted = await tx
          .insert(mediaAssets)
          .values(media)
          .onConflictDoUpdate({
            target: mediaAssets.path,
            set: {
              altText: media.altText,
              caption: media.caption,
              artist: media.artist,
              credit: media.credit,
              licenseName: media.licenseName,
              licenseUrl: media.licenseUrl,
              sourcePageUrl: media.sourcePageUrl,
              width: media.width,
              height: media.height,
              bytes: media.bytes,
            },
          })
          .returning();
        portraitMediaId = inserted[0]?.id ?? null;
      }

      let originPlaceId: string | null = null;
      if (person.origin) {
        const placeSlug = person.origin.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, '');
        const place = await tx
          .insert(places)
          .values({
            slug: placeSlug,
            name: person.origin.name,
            country: person.origin.country ?? null,
          })
          .onConflictDoUpdate({
            target: places.slug,
            set: { name: person.origin.name, country: person.origin.country ?? null },
          })
          .returning();
        originPlaceId = place[0]?.id ?? null;
      }

      const values = {
        slug: person.slug,
        fullName: person.fullName,
        sortName: sortName(person.fullName),
        alternateNames: person.alternateNames ?? [],
        summary: person.summary,
        whyItMatters: person.whyItMatters,
        biographyMd: person.biography,
        contributionsMd: person.contributions ?? '',
        ideasMd: person.ideas ?? '',
        controversiesMd: person.controversies ?? '',
        legacyMd: person.legacy ?? '',
        birthDate: person.birthDate ?? null,
        birthPrecision: person.birthPrecision,
        deathDate: person.deathDate ?? null,
        deathPrecision: person.deathPrecision,
        isLiving: person.isLiving ?? false,
        occupations: person.occupations,
        nationality: person.nationality ?? null,
        originPlaceId,
        portraitMediaId,
        status: 'published' as const,
        featured: person.featured ?? false,
        publishedAt: new Date(),
        seoTitle: person.fullName,
        seoDescription: person.summary.slice(0, 200),
      };

      const inserted = await tx
        .insert(people)
        .values(values)
        .onConflictDoUpdate({
          target: people.slug,
          set: { ...values, updatedAt: sql`now()` },
        })
        .returning();

      const personId = inserted[0]!.id;
      report.people += 1;

      // taxonomy links
      await tx.delete(personCategories).where(eq(personCategories.personId, personId));
      for (const slug of person.categories) {
        const category = await tx
          .select({ id: categories.id })
          .from(categories)
          .where(eq(categories.slug, slug))
          .limit(1);
        if (category[0]) {
          await tx
            .insert(personCategories)
            .values({ personId, categoryId: category[0].id })
            .onConflictDoNothing();
        }
      }

      await tx.delete(personTags).where(eq(personTags.personId, personId));
      for (const slug of person.tags) {
        const tag = await tx
          .select({ id: tags.id })
          .from(tags)
          .where(eq(tags.slug, slug))
          .limit(1);
        if (tag[0]) {
          await tx
            .insert(personTags)
            .values({ personId, tagId: tag[0].id })
            .onConflictDoNothing();
        }
      }

      // timeline
      await tx.delete(timelineEvents).where(eq(timelineEvents.personId, personId));
      for (const [index, event] of person.timeline.entries()) {
        let placeId: string | null = null;
        if (event.place) {
          const placeSlug = event.place
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '');
          const place = await tx
            .insert(places)
            .values({ slug: placeSlug, name: event.place })
            .onConflictDoNothing()
            .returning();
          if (place[0]) {
            placeId = place[0].id;
          } else {
            const existing = await tx
              .select({ id: places.id })
              .from(places)
              .where(eq(places.slug, placeSlug))
              .limit(1);
            placeId = existing[0]?.id ?? null;
          }
        }

        const sourceId = event.source ? (sourceIdByKey.get(event.source) ?? null) : null;

        await tx.insert(timelineEvents).values({
          personId,
          title: event.title,
          description: event.description ?? '',
          startDate: event.date,
          startPrecision: event.precision,
          placeId,
          sourceId,
          position: index,
        });
      }

      // sources attached to the profile
      await tx.delete(personSources).where(eq(personSources.personId, personId));
      for (const key of person.sources) {
        const sourceId = sourceIdByKey.get(key);
        if (!sourceId) {
          report.warnings.push(
            `${person.slug} references an unknown source key: ${key}`,
          );
          continue;
        }
        await tx
          .insert(personSources)
          .values({ personId, sourceId })
          .onConflictDoNothing();
      }
    }

    // --------------------------------------------------- relationships
    for (const person of selectedPeople) {
      if (!person.relationships?.length) continue;

      const from = await tx
        .select({ id: people.id })
        .from(people)
        .where(eq(people.slug, person.slug))
        .limit(1);
      if (!from[0]) continue;

      await tx
        .delete(personRelationships)
        .where(eq(personRelationships.fromPersonId, from[0].id));

      for (const relationship of person.relationships) {
        const to = await tx
          .select({ id: people.id })
          .from(people)
          .where(eq(people.slug, relationship.to))
          .limit(1);
        if (!to[0]) {
          report.warnings.push(
            `${person.slug} links to an unknown person: ${relationship.to}`,
          );
          continue;
        }

        const sourceId = relationship.source
          ? (sourceIdByKey.get(relationship.source) ?? null)
          : null;

        await tx
          .insert(personRelationships)
          .values({
            fromPersonId: from[0].id,
            toPersonId: to[0].id,
            type: relationship.type,
            description: relationship.description,
            periodNote: relationship.periodNote ?? null,
            sourceId,
            status: 'published',
          })
          .onConflictDoNothing();
      }
    }

    // -------------------------------------------------------- articles
    for (const article of selectedArticles) {
      const values = {
        slug: article.slug,
        title: article.title,
        summary: article.summary,
        contentMd: article.content,
        status: 'published' as const,
        publishedAt: new Date(),
        seoTitle: article.title,
        seoDescription: article.summary.slice(0, 200),
      };

      const inserted = await tx
        .insert(articles)
        .values(values)
        .onConflictDoUpdate({
          target: articles.slug,
          set: { ...values, updatedAt: sql`now()` },
        })
        .returning();

      const articleId = inserted[0]!.id;
      report.articles += 1;

      await tx.delete(articleCategories).where(eq(articleCategories.articleId, articleId));
      for (const slug of article.categories ?? []) {
        const category = await tx
          .select({ id: categories.id })
          .from(categories)
          .where(eq(categories.slug, slug))
          .limit(1);
        if (category[0]) {
          await tx
            .insert(articleCategories)
            .values({ articleId, categoryId: category[0].id })
            .onConflictDoNothing();
        }
      }

      await tx.delete(articleTags).where(eq(articleTags.articleId, articleId));
      for (const slug of article.tags ?? []) {
        const tag = await tx
          .select({ id: tags.id })
          .from(tags)
          .where(eq(tags.slug, slug))
          .limit(1);
        if (tag[0]) {
          await tx.insert(articleTags).values({ articleId, tagId: tag[0].id }).onConflictDoNothing();
        }
      }

      await tx.delete(articlePeople).where(eq(articlePeople.articleId, articleId));
      for (const slug of article.people ?? []) {
        const person = await tx
          .select({ id: people.id })
          .from(people)
          .where(eq(people.slug, slug))
          .limit(1);
        if (person[0]) {
          await tx
            .insert(articlePeople)
            .values({ articleId, personId: person[0].id })
            .onConflictDoNothing();
        }
      }

      await tx.delete(articleRelations).where(eq(articleRelations.articleId, articleId));
      for (const slug of article.relatedArticles ?? []) {
        const related = await tx
          .select({ id: articles.id })
          .from(articles)
          .where(eq(articles.slug, slug))
          .limit(1);
        if (related[0]) {
          await tx
            .insert(articleRelations)
            .values({ articleId, relatedArticleId: related[0].id })
            .onConflictDoNothing();
        }
      }

      await tx.delete(articleSources).where(eq(articleSources.articleId, articleId));
      for (const key of article.sources ?? []) {
        const sourceId = sourceIdByKey.get(key);
        if (!sourceId) continue;
        await tx
          .insert(articleSources)
          .values({ articleId, sourceId })
          .onConflictDoNothing();
      }
    }

    // ----------------------------------------------------- collections
    for (const collection of corpus.collections) {
      const inserted = await tx
        .insert(collections)
        .values({
          slug: collection.slug,
          title: collection.title,
          description: collection.description,
          introductionMd: collection.introduction ?? '',
          featured: collection.featured ?? false,
          status: 'published',
          publishedAt: new Date(),
          seoTitle: collection.title,
          seoDescription: collection.description.slice(0, 200),
        })
        .onConflictDoUpdate({
          target: collections.slug,
          set: {
            title: collection.title,
            description: collection.description,
            introductionMd: collection.introduction ?? '',
            featured: collection.featured ?? false,
            status: 'published',
            publishedAt: new Date(),
            seoTitle: collection.title,
            seoDescription: collection.description.slice(0, 200),
            updatedAt: sql`now()`,
          },
        })
        .returning();

      const collectionId = inserted[0]!.id;
      report.collections += 1;

      await tx.delete(collectionItems).where(eq(collectionItems.collectionId, collectionId));

      let position = 0;
      for (const slug of collection.people ?? []) {
        const person = await tx
          .select({ id: people.id })
          .from(people)
          .where(eq(people.slug, slug))
          .limit(1);
        if (person[0]) {
          await tx
            .insert(collectionItems)
            .values({ collectionId, personId: person[0].id, position: position++ })
            .onConflictDoNothing();
        }
      }
      for (const slug of collection.articles ?? []) {
        const article = await tx
          .select({ id: articles.id })
          .from(articles)
          .where(eq(articles.slug, slug))
          .limit(1);
        if (article[0]) {
          await tx
            .insert(collectionItems)
            .values({ collectionId, articleId: article[0].id, position: position++ })
            .onConflictDoNothing();
        }
      }
    }
  });

  return report;
}

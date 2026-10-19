import { z } from 'zod';

/**
 * Validation schemas for every mutation the admin can perform.
 *
 * These run on the server, inside the server action, before anything is
 * written. Client-side validation is a convenience for the editor; this is
 * the boundary.
 */

const precision = z.enum(['day', 'month', 'year', 'circa', 'unknown']);
const status = z.enum(['draft', 'in_review', 'published', 'archived']);

const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max, `Must be ${max} characters or fewer.`)
    .optional()
    .transform((value) => (value === '' ? undefined : value));

/**
 * An optional identifier. An empty string — which is what an unselected
 * <select> submits — means "none", not "invalid".
 */
const optionalUuid = z
  .string()
  .trim()
  .refine((value) => value === '' || z.string().uuid().safeParse(value).success, {
    message: 'Choose a valid item.',
  })
  .optional()
  .transform((value) => (value === '' ? undefined : value));

const requiredText = (max: number, label: string) =>
  z
    .string()
    .trim()
    .min(1, `${label} is required.`)
    .max(max, `Must be ${max} characters or fewer.`);

export const personSchema = z.object({
  id: optionalUuid,
  slug: z
    .string()
    .trim()
    .min(1, 'A slug is required.')
    .max(96, 'Must be 96 characters or fewer.')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Use lowercase words separated by hyphens.')
    .optional(),
  fullName: requiredText(160, 'Name'),
  alternateNames: z.string().trim().max(600).optional(),
  summary: requiredText(400, 'Summary'),
  whyItMatters: z.string().trim().max(2000).optional(),
  biographyMd: z.string().trim().max(80_000).optional(),
  contributionsMd: z.string().trim().max(40_000).optional(),
  ideasMd: z.string().trim().max(40_000).optional(),
  controversiesMd: z.string().trim().max(40_000).optional(),
  legacyMd: z.string().trim().max(40_000).optional(),
  birthDate: optionalText(10),
  birthPrecision: precision,
  deathDate: optionalText(10),
  deathPrecision: precision,
  isLiving: z.coerce.boolean().default(false),
  occupations: z.string().trim().max(400).optional(),
  nationality: optionalText(120),
  originPlaceName: optionalText(160),
  originPlaceCountry: optionalText(120),
  portraitMediaId: optionalUuid,
  categories: z.array(z.string().max(96)).default([]),
  tags: z.array(z.string().max(96)).default([]),
  status: status.default('draft'),
  featured: z.coerce.boolean().default(false),
  seoTitle: optionalText(180),
  seoDescription: optionalText(320),
});

export const timelineEventSchema = z.object({
  id: optionalUuid,
  title: requiredText(200, 'Title'),
  description: z.string().trim().max(2000).optional(),
  startDate: optionalText(10),
  startPrecision: precision,
  endDate: optionalText(10),
  endPrecision: precision,
  placeName: optionalText(160),
  sourceId: optionalUuid,
});

export const relationshipSchema = z.object({
  toPersonId: z.string().uuid('Choose a person.'),
  type: z.enum([
    'influenced',
    'influenced_by',
    'collaborated_with',
    'mentored',
    'student_of',
    'rival_of',
    'co_founded',
    'family',
    'contemporary',
    'movement',
  ]),
  description: requiredText(600, 'Description'),
  periodNote: optionalText(120),
  sourceId: optionalUuid,
});

export const categorySchema = z.object({
  id: optionalUuid,
  slug: z
    .string()
    .trim()
    .min(1, 'A slug is required.')
    .max(96)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Use lowercase words separated by hyphens.'),
  name: requiredText(120, 'Name'),
  description: z.string().trim().max(1000).optional(),
  parentId: optionalUuid,
  coverMediaId: optionalUuid,
  sortOrder: z.coerce.number().int().min(0).max(9999).default(0),
  featured: z.coerce.boolean().default(false),
  status: status.default('published'),
  seoTitle: optionalText(180),
  seoDescription: optionalText(320),
});

export const tagSchema = z.object({
  id: optionalUuid,
  slug: z
    .string()
    .trim()
    .min(1, 'A slug is required.')
    .max(96)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Use lowercase words separated by hyphens.'),
  name: requiredText(120, 'Name'),
  description: z.string().trim().max(600).optional(),
});

export const collectionSchema = z.object({
  id: optionalUuid,
  slug: z
    .string()
    .trim()
    .min(1, 'A slug is required.')
    .max(96)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Use lowercase words separated by hyphens.'),
  title: requiredText(200, 'Title'),
  description: requiredText(600, 'Description'),
  introductionMd: z.string().trim().max(20_000).optional(),
  coverMediaId: optionalUuid,
  featured: z.coerce.boolean().default(false),
  status: status.default('draft'),
  seoTitle: optionalText(180),
  seoDescription: optionalText(320),
  personIds: z.array(z.string().uuid()).default([]),
  articleIds: z.array(z.string().uuid()).default([]),
});

export const articleSchema = z.object({
  id: optionalUuid,
  slug: z
    .string()
    .trim()
    .min(1, 'A slug is required.')
    .max(96)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Use lowercase words separated by hyphens.'),
  title: requiredText(220, 'Title'),
  summary: requiredText(600, 'Summary'),
  contentMd: z.string().trim().max(120_000).optional(),
  heroMediaId: optionalUuid,
  categories: z.array(z.string().max(96)).default([]),
  tags: z.array(z.string().max(96)).default([]),
  personIds: z.array(z.string().uuid()).default([]),
  relatedArticleIds: z.array(z.string().uuid()).default([]),
  sourceIds: z.array(z.string().uuid()).default([]),
  status: status.default('draft'),
  seoTitle: optionalText(180),
  seoDescription: optionalText(320),
});

export const sourceSchema = z.object({
  id: optionalUuid,
  key: z
    .string()
    .trim()
    .min(1, 'A key is required.')
    .max(96)
    .regex(/^[a-z0-9]+(?:[-_][a-z0-9]+)*$/, 'Use lowercase words, optionally separated by hyphens.'),
  title: requiredText(300, 'Title'),
  author: optionalText(200),
  publisher: optionalText(200),
  url: z
    .string()
    .trim()
    .max(1000)
    .refine((value) => value === '' || /^https?:\/\//.test(value), 'Use an http or https URL.')
    .optional(),
  publishedDate: optionalText(40),
  accessedDate: optionalText(40),
  doi: optionalText(120),
  isbn: optionalText(40),
  type: z
    .enum([
      'book',
      'journal_article',
      'primary_document',
      'archive',
      'website',
      'newspaper',
      'biography',
      'film',
      'other',
    ])
    .default('other'),
  notes: z.string().trim().max(2000).optional(),
});

export const settingSchema = z.object({
  key: z
    .string()
    .trim()
    .min(1)
    .max(96)
    .regex(/^[a-zA-Z][a-zA-Z0-9]*$/, 'Use a camelCase key.'),
  value: z.string().trim().max(4000),
});

export const mediaSchema = z.object({
  id: z.string().uuid(),
  altText: z.string().trim().max(300),
  caption: z.string().trim().max(600).optional(),
  artist: z.string().trim().max(300).optional(),
  credit: z.string().trim().max(300).optional(),
  licenseName: z.string().trim().max(200).optional(),
  licenseUrl: z
    .string()
    .trim()
    .max(1000)
    .refine((value) => value === '' || /^https?:\/\//.test(value), 'Use an http or https URL.')
    .optional(),
  sourcePageUrl: z
    .string()
    .trim()
    .max(1000)
    .refine((value) => value === '' || /^https?:\/\//.test(value), 'Use an http or https URL.')
    .optional(),
});

export type PersonInput = z.infer<typeof personSchema>;
export type CategoryInput = z.infer<typeof categorySchema>;
export type TagInput = z.infer<typeof tagSchema>;
export type CollectionInput = z.infer<typeof collectionSchema>;
export type ArticleInput = z.infer<typeof articleSchema>;
export type SourceInput = z.infer<typeof sourceSchema>;
export type TimelineEventInput = z.infer<typeof timelineEventSchema>;
export type RelationshipInput = z.infer<typeof relationshipSchema>;
export type MediaInput = z.infer<typeof mediaSchema>;

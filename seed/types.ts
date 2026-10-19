/**
 * Shapes for the authored editorial corpus.
 *
 * The corpus lives in `seed/data/` as TypeScript modules so that editorial
 * changes show up as readable diffs in version control, and so the loader can
 * validate every record before it reaches the database.
 */

export type SeedSource = {
  /** Stable key so a source can be referenced from several records. */
  key: string;
  title: string;
  author?: string;
  publisher?: string;
  url?: string;
  publishedDate?: string;
  doi?: string;
  isbn?: string;
  type:
    | 'book'
    | 'journal_article'
    | 'primary_document'
    | 'archive'
    | 'website'
    | 'newspaper'
    | 'biography'
    | 'film'
    | 'other';
  notes?: string;
};

export type SeedTimelineEvent = {
  date: string;
  precision: 'day' | 'month' | 'year' | 'circa' | 'unknown';
  title: string;
  description?: string;
  place?: string;
  /** Key of a source that supports this event. */
  source?: string;
};

export type SeedRelationship = {
  /** Slug of the other person. */
  to: string;
  type:
    | 'influenced'
    | 'influenced_by'
    | 'collaborated_with'
    | 'mentored'
    | 'student_of'
    | 'rival_of'
    | 'co_founded'
    | 'family'
    | 'contemporary'
    | 'movement';
  description: string;
  periodNote?: string;
  source?: string;
};

export type SeedPerson = {
  slug: string;
  fullName: string;
  alternateNames?: string[];
  birthDate?: string;
  birthPrecision: 'day' | 'month' | 'year' | 'circa' | 'unknown';
  deathDate?: string;
  deathPrecision: 'day' | 'month' | 'year' | 'circa' | 'unknown';
  isLiving?: boolean;
  occupations: string[];
  nationality?: string;
  origin?: { name: string; country?: string };
  featured?: boolean;
  summary: string;
  whyItMatters: string;
  biography: string;
  contributions?: string;
  ideas?: string;
  controversies?: string;
  legacy?: string;
  categories: string[];
  tags: string[];
  timeline: SeedTimelineEvent[];
  relationships?: SeedRelationship[];
  sources: string[];
  /** Title of the Wikipedia article used to source facts and the portrait. */
  wikipedia?: string;
};

export type SeedCategory = {
  slug: string;
  name: string;
  description: string;
  parent?: string;
  sortOrder: number;
  featured?: boolean;
};

export type SeedTag = {
  slug: string;
  name: string;
  description?: string;
};

export type SeedPeriod = {
  slug: string;
  name: string;
  startYear: number;
  endYear: number;
  description: string;
};

export type SeedCollection = {
  slug: string;
  title: string;
  description: string;
  introduction?: string;
  featured?: boolean;
  /** Person slugs, in order. */
  people?: string[];
  /** Article slugs, in order, after the people. */
  articles?: string[];
};

export type SeedArticle = {
  slug: string;
  title: string;
  summary: string;
  content: string;
  categories?: string[];
  tags?: string[];
  people?: string[];
  relatedArticles?: string[];
  sources?: string[];
  heroWikipedia?: string;
};

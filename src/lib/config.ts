/**
 * Brand defaults. Everything here can be overridden at runtime from the
 * `site_settings` table (edited in /admin/settings) so the publication can be
 * renamed without touching code.
 */
export const brand = {
  name: 'The Influence Archive',
  shortName: 'The Archive',
  tagline: 'People who shaped the way we think, live, and see the world.',
  description:
    'An editorial archive of influential people — scientists, philosophers, engineers, artists, writers, reformers and others whose ideas and actions shaped the world.',
  homeHeadline: 'Understand the people who changed the world.',
  homeStandfirst:
    'Explore the lives, ideas, breakthroughs and legacies that shaped how humanity thinks and lives.',
  contactEmail: '',
  founded: '2026',
} as const;

export type Brand = typeof brand;

export const navigation = [
  { href: '/explore', label: 'Explore' },
  { href: '/categories', label: 'Fields' },
  { href: '/collections', label: 'Collections' },
  { href: '/articles', label: 'Essays' },
  { href: '/about', label: 'About' },
] as const;

export const footerSections = [
  {
    title: 'Browse',
    links: [
      { href: '/explore', label: 'All figures' },
      { href: '/categories', label: 'By field' },
      { href: '/collections', label: 'Collections' },
      { href: '/articles', label: 'Essays' },
      { href: '/search', label: 'Search' },
    ],
  },
  {
    title: 'The Archive',
    links: [
      { href: '/about', label: 'About' },
      { href: '/editorial-standards', label: 'Editorial standards' },
      { href: '/editorial-standards#sources', label: 'Sources & corrections' },
      { href: '/privacy', label: 'Privacy' },
      { href: '/terms', label: 'Terms' },
    ],
  },
] as const;

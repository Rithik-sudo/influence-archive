/**
 * Date formatting that never invents precision.
 *
 * A person recorded as "c. 350" must not be rendered as "350". Every helper
 * takes the stored date together with its precision and shows only what is
 * actually known.
 */

export type Precision = 'day' | 'month' | 'year' | 'circa' | 'unknown';

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

/** Parses the `YYYY-MM-DD` strings we store, treating them as UTC dates. */
function parseIsoDate(value: string): Date | null {
  const match = /^(\d{4})(?:-(\d{2}))?(?:-(\d{2}))?/.exec(value);
  if (!match) return null;

  const year = Number(match[1]);
  const month = match[2] ? Number(match[2]) : 1;
  const day = match[3] ? Number(match[3]) : 1;

  const date = new Date(Date.UTC(year, month - 1, day));
  if (Number.isNaN(date.getTime())) return null;
  return date;
}

/** "1815" | "December 1815" | "10 December 1815" — limited by precision. */
export function formatDate(value: string | null | undefined, precision: Precision): string {
  if (!value || precision === 'unknown') return '';

  const date = parseIsoDate(value);
  if (!date) return '';

  const year = date.getUTCFullYear();
  const month = date.getUTCMonth();
  const day = date.getUTCDate();

  if (precision === 'day') {
    return `${day} ${MONTHS[month]} ${year}`;
  }
  if (precision === 'month') {
    return `${MONTHS[month]} ${year}`;
  }
  if (precision === 'circa') {
    return `c. ${year}`;
  }
  return `${year}`;
}

/** "1815 – 1852", "c. 350 – 370", "1815 – 1852 (aged 36)". */
export function formatLifespan(
  birth: { date: string | null; precision: Precision },
  death: { date: string | null; precision: Precision },
  isLiving = false,
): string {
  const birthText = formatDate(birth.date, birth.precision);
  const deathText = isLiving ? 'present' : formatDate(death.date, death.precision);

  if (!birthText && !deathText) return 'Dates unknown';
  if (isLiving) return birthText ? `${birthText} – present` : 'Dates unknown';
  if (!deathText) return birthText ? `${birthText} – ?` : 'Dates unknown';
  if (!birthText) return `? – ${deathText}`;
  return `${birthText} – ${deathText}`;
}

/**
 * A single-line form for cards and metadata: "1815–1852".
 *
 * Only the year is shown, whatever the recorded precision, because the year is
 * the part that is always known.
 */
export function formatLifespanCompact(
  birth: { date: string | null; precision: Precision },
  death: { date: string | null; precision: Precision },
  isLiving = false,
): string {
  const birthText = formatYear(birth.date, birth.precision);
  const deathText = isLiving ? '' : formatYear(death.date, death.precision);

  if (!birthText && !deathText) return '';
  if (isLiving) return birthText ? `${birthText}–` : '';
  if (!deathText) return birthText ? `${birthText}–?` : '';
  if (!birthText) return `–${deathText}`;
  return `${birthText}–${deathText}`;
}

/** "12 March 2026" — used for publication dates, which are always exact. */
export function formatPublishedDate(value: Date | string | null | undefined): string {
  if (!value) return '';
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return `${date.getUTCDate()} ${MONTHS[date.getUTCMonth()]} ${date.getUTCFullYear()}`;
}

/** Year only, for sorting and era filters. */
export function yearOf(value: string | null | undefined): number | null {
  if (!value) return null;
  const match = /^(\d{4})/.exec(value);
  if (!match) return null;
  const year = Number(match[1]);
  return Number.isFinite(year) ? year : null;
}

/** The year alone, with the circa marker kept. */
function formatYear(value: string | null, precision: Precision): string {
  if (!value || precision === 'unknown') return '';
  const year = yearOf(value);
  if (year === null) return '';
  return precision === 'circa' ? `c. ${year}` : `${year}`;
}

/**
 * The age at death, worked out properly rather than by subtracting years.
 *
 * Ada Lovelace was born on 10 December 1815 and died on 27 November 1852,
 * which is 36, not 37. The month and day are used when they are known.
 *
 * Returns null when the record is too loose to support an exact figure:
 * an approximate birth date is not precise enough to give a whole number of
 * years without pretending to a precision the sources do not have.
 */
export function ageAtDeath(
  birth: { date: string | null; precision: Precision },
  death: { date: string | null; precision: Precision },
): number | null {
  if (!birth.date || !death.date) return null;
  if (birth.precision === 'unknown' || death.precision === 'unknown') return null;
  if (birth.precision === 'circa' || death.precision === 'circa') return null;

  const born = parseIsoDate(birth.date);
  const died = parseIsoDate(death.date);
  if (!born || !died) return null;

  let age = died.getUTCFullYear() - born.getUTCFullYear();
  const monthDifference = died.getUTCMonth() - born.getUTCMonth();
  if (monthDifference < 0 || (monthDifference === 0 && died.getUTCDate() < born.getUTCDate())) {
    age -= 1;
  }

  return age >= 0 && age < 125 ? age : null;
}

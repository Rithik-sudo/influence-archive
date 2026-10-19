import { describe, expect, it } from 'vitest';
import {
  ageAtDeath,
  formatDate,
  formatLifespan,
  formatLifespanCompact,
  formatPublishedDate,
  yearOf,
} from '@/lib/format';

describe('formatDate', () => {
  it('shows the full date when the precision is a day', () => {
    expect(formatDate('1815-12-10', 'day')).toBe('10 December 1815');
  });

  it('shows the month and year for a month', () => {
    expect(formatDate('1815-12-10', 'month')).toBe('December 1815');
  });

  it('shows the year for a year', () => {
    expect(formatDate('1815-12-10', 'year')).toBe('1815');
  });

  it('marks an approximate date as such', () => {
    expect(formatDate('0350-01-01', 'circa')).toBe('c. 350');
  });

  it('shows nothing when the date is unknown', () => {
    expect(formatDate('0350-01-01', 'unknown')).toBe('');
    expect(formatDate(null, 'day')).toBe('');
  });
});

describe('formatLifespan', () => {
  it('joins both ends', () => {
    expect(
      formatLifespan(
        { date: '1815-12-10', precision: 'day' },
        { date: '1852-11-27', precision: 'day' },
      ),
    ).toBe('10 December 1815 – 27 November 1852');
  });

  it('marks the present for a living person', () => {
    expect(
      formatLifespan({ date: '1970-01-01', precision: 'day' }, { date: null, precision: 'unknown' }, true),
    ).toBe('1 January 1970 – present');
  });

  it('says so when the dates are unknown', () => {
    expect(
      formatLifespan({ date: null, precision: 'unknown' }, { date: null, precision: 'unknown' }),
    ).toBe('Dates unknown');
  });

  it('does not invent an end date', () => {
    expect(
      formatLifespan({ date: '1815-12-10', precision: 'day' }, { date: null, precision: 'unknown' }),
    ).toBe('10 December 1815 – ?');
  });
});

describe('formatLifespanCompact', () => {
  it('produces a single-line form', () => {
    expect(
      formatLifespanCompact(
        { date: '1815-12-10', precision: 'day' },
        { date: '1852-11-27', precision: 'day' },
      ),
    ).toBe('1815–1852');
  });

  it('keeps the circa marker', () => {
    expect(
      formatLifespanCompact(
        { date: '0350-01-01', precision: 'circa' },
        { date: '0415-01-01', precision: 'circa' },
      ),
    ).toBe('c. 350–c. 415');
  });
});

describe('ageAtDeath', () => {
  it('computes the age when both dates are known', () => {
    expect(
      ageAtDeath(
        { date: '1815-12-10', precision: 'day' },
        { date: '1852-11-27', precision: 'day' },
      ),
    ).toBe(36);
  });

  it('refuses to guess when a date is only approximate', () => {
    expect(
      ageAtDeath(
        { date: '0350-01-01', precision: 'circa' },
        { date: '0415-01-01', precision: 'circa' },
      ),
    ).toBeNull();
    expect(
      ageAtDeath(
        { date: null, precision: 'unknown' },
        { date: '1852-11-27', precision: 'day' },
      ),
    ).toBeNull();
  });

  it('refuses an implausible age', () => {
    expect(
      ageAtDeath(
        { date: '1700-01-01', precision: 'year' },
        { date: '1900-01-01', precision: 'year' },
      ),
    ).toBeNull();
  });
});

describe('yearOf', () => {
  it('reads the year from an ISO date', () => {
    expect(yearOf('1815-12-10')).toBe(1815);
  });

  it('returns null for a missing date', () => {
    expect(yearOf(null)).toBeNull();
    expect(yearOf('not a date')).toBeNull();
  });
});

describe('formatPublishedDate', () => {
  it('formats a date', () => {
    expect(formatPublishedDate('2026-09-04T00:00:00Z')).toBe('4 September 2026');
  });

  it('returns an empty string for nothing', () => {
    expect(formatPublishedDate(null)).toBe('');
  });
});

import { describe, expect, it } from 'vitest';
import {
  findBoulderGradeIndex,
  findRockGradeIndex,
  formatRockGrade,
  getBoulderGradeRow,
  getRockGradeRow,
} from './grades';

describe('findRockGradeIndex', () => {
  it('resolves a grade that appears at a single index', () => {
    expect(findRockGradeIndex('french', '1-')).toBe(1);
  });

  it('picks the middle index when a grade label maps to two rows', () => {
    // French '6a+' appears at indexes 21 and 22.
    expect(findRockGradeIndex('french', '6a+')).toBe(22);
  });

  it('picks the middle index when a grade label maps to three rows', () => {
    // French '6b' appears at indexes 23, 24, 25.
    expect(findRockGradeIndex('french', '6b')).toBe(24);
  });

  it('returns undefined for a grade that does not exist on that scale', () => {
    expect(findRockGradeIndex('french', 'not-a-real-grade')).toBeUndefined();
  });
});

describe('findBoulderGradeIndex', () => {
  it('resolves a grade that appears at a single index', () => {
    expect(findBoulderGradeIndex('vScale', 'V-easy')).toBe(1);
  });

  it('picks the middle index when a grade label maps to three rows', () => {
    // Font scale '5' appears at indexes 7, 8, 9.
    expect(findBoulderGradeIndex('fontScale', '5')).toBe(8);
  });

  it('returns undefined for a grade that does not exist on that scale', () => {
    expect(findBoulderGradeIndex('vScale', 'not-a-real-grade')).toBeUndefined();
  });
});

describe('getRockGradeRow / getBoulderGradeRow', () => {
  it('finds a row by index', () => {
    expect(getRockGradeRow(1)?.[2]).toBe('1-');
    expect(getBoulderGradeRow(1)?.[1]).toBe('V-easy');
  });

  it('returns undefined for an out-of-range index', () => {
    expect(getRockGradeRow(9999)).toBeUndefined();
    expect(getBoulderGradeRow(9999)).toBeUndefined();
  });
});

describe('formatRockGrade', () => {
  it('formats a known index on a given scale', () => {
    expect(formatRockGrade(1, 'french')).toBe('1-');
    expect(formatRockGrade(1, 'usa')).toBe('3rd');
  });

  it('returns an empty string for an out-of-range index instead of throwing', () => {
    expect(formatRockGrade(9999, 'french')).toBe('');
  });
});

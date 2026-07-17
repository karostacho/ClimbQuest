// Static climbing-grade reference data, ported from the old Flask app's
// helper.py / rock_climbing_grades & bouldering_grades DB tables. This data
// never changes, so it lives here as a plain module instead of round-tripping
// through the backend - grade conversion is pure client-side lookup.

export type RockGradeRow = readonly [
  index: number,
  usa: string,
  french: string,
  uiaa: string,
  british: string,
  kurtyka: string,
];

export type BoulderGradeRow = readonly [index: number, vScale: string, fontScale: string];

export const ROCK_GRADES: RockGradeRow[] = [
  [1, '3rd', '1-', 'I', 'M 1a', 'I'], [2, '4th', '1', 'I', 'M 1b', 'I'], [3, 'Easy 5th', '1+', 'I', 'M 1c', 'I'],
  [4, '5.0', '2-', 'I', 'MM 1c', 'I'], [5, '5.1', '2', 'II', 'MD 2a', 'II'], [6, '5.2', '3', 'II', 'D 2c', 'II'],
  [7, '5.3', '3+', 'III', 'VD 3a', 'III'], [8, '5.4', '4a', 'IV', 'VD 3c', 'IV'], [9, '5.5', '4b', 'IV+', 'MS 4a', 'IV'],
  [10, '5.6', '4c', 'V', 'S 4b', 'IV+'], [11, '5.7', '5a', 'V+', 'MVS 4b', 'V-'], [12, '5.7+', '5a', 'V+', 'MVS 4b', 'V-'],
  [13, '5.8-', '5b', 'VI-', 'VS 4c', 'V'], [14, '5.8', '5b', 'VI-', 'HVS 4c', 'V'], [15, '5.8+', '5b', 'VI-', 'HVS 4c', 'V'],
  [16, '5.9-', '5c', 'VI', 'HVS 4c', 'V+'], [17, '5.9', '5c', 'VI', 'HVS 5a', 'V+'], [18, '5.9+', '5c', 'VI', 'E1 5a', 'V+'],
  [19, '5.10a', '6a', 'VI+', 'E1 5a', 'VI'], [20, '5.10-', '6a', 'VI+', 'E1 5a', 'VI'],
  [21, '5.10a/b', '6a+', 'VI+', 'E2 5b', 'VI+'], [22, '5.10b', '6a+', 'VII-', 'E2 5b', 'VI+'], [23, '5.10', '6b', 'VII-', 'E2 5b', 'VI.1'],
  [24, '5.10b/c', '6b', 'VII', 'E2 5b', 'VI.1'], [25, '5.10c', '6b', 'VII', 'E2 5b', 'VI.1'], [26, '5.10+', '6b+', 'VII+', 'E3 5b', 'VI.1+'],
  [27, '5.10c/d', '6b+', 'VII+', 'E3 5b', 'VI.1+'], [28, '5.10d', '6b+', 'VII+', 'E3 5b', 'VI.1+'], [29, '5.11a', '6c', 'VII+', 'E3 5c', 'VI.2'],
  [30, '5.11-', '6c', 'VIII-', 'E3 5c', 'VI.2'], [31, '5.11a/b', '6c', 'VIII-', 'E3 5c', 'VI.2'], [32, '5.11b', '6c', 'VIII-', 'E3 5c', 'VI.2'],
  [33, '5.11', '6c+', 'VIII-', 'E4 5c', 'VI.2+'], [34, '5.11b/c', '6c+', 'VIII-', 'E4 6a', 'VI.2+'], [35, '5.11c', '6c+', 'VIII-', 'E4 6a', 'VI.2+'],
  [36, '5.11+', '7a', 'VIII', 'E4 6a', 'VI.3'], [37, '5.11c/d', '7a', 'VIII', 'E4 6a', 'VI.3'], [38, '5.11d', '7a', 'VIII', 'E5 6a', 'VI.3'],
  [39, '5.12a', '7a+', 'VIII+', 'E5 6a', 'VI.3+'], [40, '5.12-', '7a+', 'VIII+', 'E5 6a', 'VI.3+'], [41, '5.12a/b', '7b', 'VIII+', 'E5 6a', 'VI.4'],
  [42, '5.12b', '7b', 'VIII+', 'E5 6b', 'VI.4+'], [43, '5.12', '7b+', 'VIII+', 'E6 6b', 'VI.4+'], [44, '5.12b/c', '7b+', 'IX-', 'E6 6b', 'VI.4+'],
  [45, '5.12c', '7b+', 'IX-', 'E6 6b', 'VI.4+'], [46, '5.12+', '7c', 'IX', 'E6 6b', 'VI.4+'], [47, '5.12c/d', '7c', 'IX', 'E6 6b', 'VI.4+'],
  [48, '5.12d', '7c', 'IX', 'E6 6b', 'VI.4+'], [49, '5.13a', '7c+', 'IX+', 'E6 6c', 'VI.5'], [50, '5.13-', '7c+', 'IX+', 'E7 6c', 'VI.5'],
  [51, '5.13a/b', '8a', 'IX+', 'E7 6c', 'VI.5+'], [52, '5.13b', '8a', 'IX+', 'E7 6c', 'VI.5+'], [53, '5.13', '8a', 'X-', 'E7 6c', 'VI.5+'],
  [54, '5.13b/c', '8a+', 'X-', 'E7 6c', 'VI.5+'], [55, '5.13c', '8a+', 'X-', 'E7 7a', 'VI.5+'], [56, '5.13+', '8b', 'X-', 'E7 7a', 'VI.6'],
  [57, '5.13c/d', '8b', 'X', 'E8 7a', 'VI.6+'], [58, '5.13d', '8b', 'X', 'E8 7a', 'VI.6+'], [59, '5.14a', '8b+', 'X+', 'E8 7a', 'VI.6+'],
  [60, '5.14-', '8b+', 'X+', 'E8 7a', 'VI.6+'], [61, '5.14a/b', '8c', 'X+', 'E9 7b', 'VI.7'], [62, '5.14b', '8c', 'X+', 'E9 7b', 'VI.7'],
  [63, '5.14', '8c+', 'XI-', 'E9 7b', 'VI.7+'], [64, '5.14b/c', '8c+', 'XI-', 'E9 7b', 'VI.7+'], [65, '5.14c', '8c+', 'XI-', 'E9 7b', 'VI.7+'],
  [66, '5.14+', '9a', 'XI', 'E10 7b', 'VI.8'], [67, '5.14c/d', '9a', 'XI', 'E10 7b', 'VI.8'], [68, '5.14d', '9a', 'XI', 'E10 7c', 'VI.8'],
  [69, '5.15a', '9a+', 'XI+', 'E11 7c', 'VI.8+'], [70, '5.15-', '9a+', 'XI+', 'E11 7c', 'VI.8+'], [71, '5.15a/b', '9a+', 'XII-', 'E11 7c', 'VI.8+'],
  [72, '5.15b', '9b', 'XII-', 'E11 8a', 'VI.9'], [73, '5.15', '9b', 'XII', 'E11 8a', 'VI.9'], [74, '5.15c', '9b+', 'XII', 'E11 8a', 'VI.9'],
  [75, '5.15+', '9b+', 'XII+', 'E11 8b', 'VI.9+'], [76, '5.15c/d', '9c', 'XIII-', 'E11 8c', 'VI.9+'], [77, '5.15d', '9c', 'XIII-', 'E11 8c', 'VI.9+'],
];

export const BOULDER_GRADES: BoulderGradeRow[] = [
  [1, 'V-easy', '3'], [2, 'V0-', '4-'], [3, 'V0', '4'], [4, 'V0+', '4+'], [5, 'V0-1', '4+'], [6, 'V1-', '5-'], [7, 'V1', '5'],
  [8, 'V1+', '5'], [9, 'V1-2', '5'], [10, 'V2-', '5+'], [11, 'V2', '5+'], [12, 'V2+', '5+'], [13, 'V2-3', '5+'], [14, 'V3-', '6A'],
  [15, 'V3', '6A'], [16, 'V3+', '6A+'], [17, 'V3-4', '6A+'], [18, 'V4-', '6B'], [19, 'V4', '6B'], [20, 'V4+', '6B+'], [21, 'V4-5', '6B+'],
  [22, 'V5-', '6C'], [23, 'V5', '6C'], [24, 'V5+', '6C+'], [25, 'V5-6', '6C+'], [26, 'V6-', '7A'], [27, 'V6', '7A'], [28, 'V6+', '7A'],
  [29, 'V6-7', '7A+'], [30, 'V7-', '7A+'], [31, 'V7', '7A+'], [32, 'V7+', '7A+'], [33, 'V7-8', '7B'], [34, 'V8-', '7B'], [35, 'V8', '7B'],
  [36, 'V8+', '7B+'], [37, 'V8-9', '7B+'], [38, 'V9-', '7C'], [39, 'V9', '7C'], [40, 'V9+', '7C'], [41, 'V9-10', '7C+'], [42, 'V10-', '7C+'],
  [43, 'V10', '7C+'], [44, 'V10+', '7C+'], [45, 'V10-11', '8A'], [46, 'V11-', '8A'], [47, 'V11', '8A'], [48, 'V11+', '8A'],
  [49, 'V11-12', '8A+'], [50, 'V12-', '8A+'], [51, 'V12', '8A+'], [52, 'V12+', '8A+'], [53, 'V12-13', '8B'], [54, 'V13-', '8B'],
  [55, 'V13', '8B'], [56, 'V13+', '8B'], [57, 'V13-14', '8B+'], [58, 'V14-', '8B+'], [59, 'V14', '8B+'], [60, 'V14+', '8B+'],
  [61, 'V14-15', '8C'], [62, 'V15-', '8C'], [63, 'V15', '8C'], [64, 'V15+', '8C'], [65, 'V15-16', '8C+'], [66, 'V16-', '8C+'],
  [67, 'V16', '8C+'], [68, 'V16+', '8C+'], [69, 'V16-17', '9A'], [70, 'V17-', '9A'], [71, 'V17', '9A'],
];

export const FRENCH = ['1-', '1', '1+', '2-', '2', '3', '3+', '4a', '4b', '4c', '5a', '5b', '5c', '6a', '6a+', '6b', '6b+', '6c', '6c+', '7a', '7a+', '7b', '7b+', '7c', '7c+', '8a', '8a+', '8b', '8b+', '8c', '8c+', '9a', '9a+', '9b', '9b+', '9c'];
export const UIAA = ['I', 'II', 'III', 'IV', 'IV+', 'V', 'V+', 'VI-', 'VI', 'VI+', 'VII-', 'VII', 'VII+', 'VIII-', 'VIII', 'VIII+', 'IX-', 'IX', 'IX+', 'X-', 'X', 'X+', 'XI-', 'XI', 'XI+', 'XII-', 'XII', 'XII+', 'XIII-'];
export const USA = ['3rd', '4th', 'Easy 5th', '5.0', '5.1', '5.2', '5.3', '5.4', '5.5', '5.6', '5.7', '5.7+', '5.8-', '5.8', '5.8+', '5.9-', '5.9', '5.9+', '5.10a', '5.10-', '5.10a/b', '5.10b', '5.10', '5.10b/c', '5.10c', '5.10+', '5.10c/d', '5.10d', '5.11a', '5.11-', '5.11a/b', '5.11b', '5.11', '5.11b/c', '5.11c', '5.11+', '5.11c/d', '5.11d', '5.12a', '5.12-', '5.12a/b', '5.12b', '5.12', '5.12b/c', '5.12c', '5.12+', '5.12c/d', '5.12d', '5.13a', '5.13-', '5.13a/b', '5.13b', '5.13', '5.13b/c', '5.13c', '5.13+', '5.13c/d', '5.13d', '5.14a', '5.14-', '5.14a/b', '5.14b', '5.14', '5.14b/c', '5.14c', '5.14+', '5.14c/d', '5.14d', '5.15a', '5.15-', '5.15a/b', '5.15b', '5.15', '5.15c', '5.15+', '5.15c/d', '5.15d'];
export const BRITISH = ['M 1a', 'M 1b', 'M 1c', 'MM 1c', 'MD 2a', 'D 2c', 'VD 3a', 'VD 3c', 'MS 4a', 'S 4b', 'MVS 4b', 'VS 4c', 'HVS 4c', 'HVS 5a', 'E1 5a', 'E2 5b', 'E3 5b', 'E3 5c', 'E4 5c', 'E4 6a', 'E5 6a', 'E5 6b', 'E6 6b', 'E6 6c', 'E7 6c', 'E7 7a', 'E8 7a', 'E9 7b', 'E10 7b', 'E10 7c', 'E11 7c', 'E11 8a', 'E11 8b', 'E11 8c'];
export const KURTYKA = ['I', 'II', 'III', 'IV', 'IV+', 'V-', 'V', 'V+', 'VI', 'VI+', 'VI.1', 'VI.1+', 'VI.2', 'VI.2+', 'VI.3', 'VI.3+', 'VI.4', 'VI.4+', 'VI.5', 'VI.5+', 'VI.6', 'VI.6+', 'VI.7', 'VI.7+', 'VI.8', 'VI.8+', 'VI.9', 'VI.9+'];
export const V_SCALE = ['V-easy', 'V0-', 'V0', 'V0+', 'V0-1', 'V1-', 'V1', 'V1+', 'V1-2', 'V2-', 'V2', 'V2+', 'V2-3', 'V3-', 'V3', 'V3+', 'V3-4', 'V4-', 'V4', 'V4+', 'V4-5', 'V5-', 'V5', 'V5+', 'V5-6', 'V6-', 'V6', 'V6+', 'V6-7', 'V7-', 'V7', 'V7+', 'V7-8', 'V8-', 'V8', 'V8+', 'V8-9', 'V9-', 'V9', 'V9+', 'V9-10', 'V10-', 'V10', 'V10+', 'V10-11', 'V11-', 'V11', 'V11+', 'V11-12', 'V12-', 'V12', 'V12+', 'V12-13', 'V13-', 'V13', 'V13+', 'V13-14', 'V14-', 'V14', 'V14+', 'V14-15', 'V15-', 'V15', 'V15+', 'V15-16', 'V16-', 'V16', 'V16+', 'V16-17', 'V17-', 'V17'];
export const FONT_SCALE = ['3', '4-', '4', '4+', '5-', '5', '5+', '6A', '6A+', '6B', '6B+', '6C', '6C+', '7A', '7A+', '7B', '7B+', '7C', '7C+', '8A', '8A+', '8B', '8B+', '8C', '8C+', '9A'];

export type RockScale = 'usa' | 'french' | 'uiaa' | 'british' | 'kurtyka';
export type BoulderScale = 'vScale' | 'fontScale';

// Insertion order here drives the dropdown display order on the home page,
// matching the old template's French / Kurtyka / UIAA / USA / British layout.
export const ROCK_SCALE_LISTS: Record<RockScale, string[]> = {
  french: FRENCH,
  kurtyka: KURTYKA,
  uiaa: UIAA,
  usa: USA,
  british: BRITISH,
};

export const BOULDER_SCALE_LISTS: Record<BoulderScale, string[]> = {
  vScale: V_SCALE,
  fontScale: FONT_SCALE,
};

const ROCK_SCALE_COLUMN: Record<RockScale, number> = {
  usa: 1,
  french: 2,
  uiaa: 3,
  british: 4,
  kurtyka: 5,
};

const BOULDER_SCALE_COLUMN: Record<BoulderScale, number> = {
  vScale: 1,
  fontScale: 2,
};

// Mirrors SqlData.get_middle_value from the old backend: a scale label (e.g.
// "5.10") can map to several numeric grade indexes, so the middle one is
// used as the representative index.
function middleValue(indexes: number[]): number | undefined {
  if (indexes.length === 0) return undefined;
  return indexes[Math.floor(indexes.length / 2)];
}

export function findRockGradeIndex(scale: RockScale, grade: string): number | undefined {
  const column = ROCK_SCALE_COLUMN[scale];
  const matches = ROCK_GRADES.filter((row) => row[column] === grade).map((row) => row[0]);
  return middleValue(matches);
}

export function findBoulderGradeIndex(scale: BoulderScale, grade: string): number | undefined {
  const column = BOULDER_SCALE_COLUMN[scale];
  const matches = BOULDER_GRADES.filter((row) => row[column] === grade).map((row) => row[0]);
  return middleValue(matches);
}

export function getRockGradeRow(index: number): RockGradeRow | undefined {
  return ROCK_GRADES.find((row) => row[0] === index);
}

export function getBoulderGradeRow(index: number): BoulderGradeRow | undefined {
  return BOULDER_GRADES.find((row) => row[0] === index);
}

export function formatRockGrade(index: number, scale: RockScale): string {
  const row = getRockGradeRow(index);
  return row ? (row[ROCK_SCALE_COLUMN[scale]] as string) : '';
}

export const DEFAULT_ROCK_INDEX = 24;
export const DEFAULT_BOULDER_INDEX = 18;

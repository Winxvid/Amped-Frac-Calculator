export const PROPPANT_DATA = [
  { type: 'Natural Brown Sand', bulk: 91, sg: 2.65 },
  { type: 'Natural White Sand', bulk: 95, sg: 2.65 },
  { type: 'Resin Coated Sand', bulk: 93, sg: 2.55 },
  { type: 'Low Density Ceramic', bulk: 95, sg: 2.7 },
  { type: 'Medium Density Ceramic', bulk: 108, sg: 3.2 },
  { type: 'High Density Ceramic', bulk: 125, sg: 3.5 },
  { type: 'Breaker (Enzymatic/Chem)', bulk: 56, sg: 1.35 },
];

export const TOTE_TYPES = [
  { label: '330-gal tote', factor: 7.45 },
  { label: '550-gal Soft side', factor: 8.72 },
  { label: '560-gal Gel (S&S)', factor: 8.55 },
  { label: '750-gal Gel Tote', factor: 12.33 },
];

export const HCL_TABLE: [number, number][] = [
  [5, 8.54],
  [10, 8.75],
  [15, 8.97],
  [20, 9.18],
  [25, 9.39],
  [28, 9.52],
  [32, 9.67],
];

export const RULES_OF_FOUR: [string, string][] = [
  ['40 lb / PPT', '10.0 GPT LGA'],
  ['30 lb / PPT', '7.5 GPT LGA'],
  ['24 lb / PPT', '6.0 GPT LGA'],
  ['20 lb / PPT', '5.0 GPT LGA'],
  ['16 lb / PPT', '4.0 GPT LGA'],
  ['10 lb / PPT', '2.5 GPT LGA'],
  ['Lb System', 'Visc (cp) + 4'],
  ['Target Visc', 'Lb System − 4'],
];

export const TUBULAR_DATA = [
  { type: '2.375" 4.7#', factor: 0.1624, id: 1.995 },
  { type: '2.875" 6.5#', factor: 0.2431, id: 2.441 },
  { type: '4.5" 11.6#', factor: 0.6528, id: 4.0 },
  { type: '4.5" 12.75#', factor: 0.6392, id: 3.958 },
  { type: '4.5" 13.5#', factor: 0.6269, id: 3.92 },
  { type: '4.5" 15.1#', factor: 0.5972, id: 3.826 },
  { type: '5.5" 17#', factor: 0.9764, id: 4.892 },
  { type: '5.5" 20#', factor: 0.9314, id: 4.778 },
  { type: '5.5" 23#', factor: 0.8898, id: 4.67 },
  { type: '7" 23#', factor: 1.6535, id: 6.366 },
  { type: '7" 26#', factor: 1.607, id: 6.276 },
  { type: '7" 29#', factor: 1.5603, id: 6.184 },
  { type: '7" 32#', factor: 1.5152, id: 6.094 },
];

export const BASE_GEARS: [number, number][] = [
  [1, 4.2],
  [2, 4.9],
  [3, 5.7],
  [4, 6.8],
  [5, 7.9],
  [6, 9.3],
  [7, 10.7],
];
export const EXTRA_GEARS: [number, number][] = [
  [8, 12.4],
  [9, 14.6],
];

export const ANALOG_DEVICES = [
  { label: 'Custom', min: 0, max: 100 },
  { label: 'Pressure 0-15k', min: 0, max: 15000 },
  { label: 'Rate 0-20 BPM', min: 0, max: 20 },
  { label: 'Density 8-20 ppg', min: 8, max: 20 },
];

export const UNIT_CATEGORIES: Record<
  string,
  {
    units: string[];
    labels: Record<string, string>;
    toBase: Record<string, number>;
  }
> = {
  Volume: {
    units: ['BBL', 'GAL', 'FT3', 'IN3', 'M3'],
    labels: {
      BBL: 'Barrels (bbl)',
      GAL: 'Gallons (gal)',
      FT3: 'Cubic Feet (ft³)',
      IN3: 'Cubic Inches (in³)',
      M3: 'Cubic Meters (m³)',
    },
    toBase: { BBL: 42, GAL: 1, FT3: 7.480519, IN3: 1 / 231, M3: 264.172 },
  },
  Density: {
    units: ['LBS_GAL', 'G_ML', 'KG_M3', 'LBS_FT3'],
    labels: {
      LBS_GAL: 'lbs/gal (ppg)',
      G_ML: 'g/ml',
      KG_M3: 'kg/m³',
      LBS_FT3: 'lb/ft³',
    },
    toBase: {
      LBS_GAL: 1,
      G_ML: 8.3454,
      KG_M3: 1 / 120.05,
      LBS_FT3: 1 / 7.480519,
    },
  },
  Weight: {
    units: ['LB', 'KG'],
    labels: { LB: 'Pounds (lb)', KG: 'Kilograms (kg)' },
    toBase: { LB: 1, KG: 2.204622 },
  },
  Length: {
    units: ['FT', 'IN'],
    labels: { FT: 'Feet (ft)', IN: 'Inches (in)' },
    toBase: { FT: 1, IN: 1 / 12 },
  },
  Concentration: {
    units: ['PPT', 'G_L'],
    labels: { PPT: 'PPT (lb/1000gal)', G_L: 'g/L' },
    toBase: { PPT: 1, G_L: 1 / 0.11982 },
  },
};

export const ACRONYMS_DATA = [
  { abbr: 'AVF', name: 'Absolute Volume Factor' },
  { abbr: 'BBL', name: 'Oil Barrels (42 Gallons)' },
  { abbr: 'BPM', name: 'Barrels Per Minute' },
  { abbr: 'cp', name: 'Centipoise (viscosity)' },
  { abbr: 'Cum', name: 'Cumulative Total' },
  { abbr: 'GPM', name: 'Gallons Per Minute' },
  { abbr: 'GPT', name: 'Gallons Per Thousand' },
  { abbr: 'Lbs', name: 'Pounds (US Standard)' },
  { abbr: 'LGA', name: 'Liquid Guar Additive' },
  { abbr: 'mA', name: 'MilliAmps' },
  { abbr: 'PPA', name: 'Pounds Proppant Added' },
  { abbr: 'PPG', name: 'Pounds Per Gallon' },
  { abbr: 'PPM', name: 'Pounds Per Minute' },
  { abbr: 'PPR', name: 'Pounds Per Revolution' },
  { abbr: 'PPT', name: 'Pounds Per Thousand' },
  { abbr: 'Prop Conc', name: 'Proppant Concentration' },
  { abbr: 'PSI', name: 'Pounds Per Square Inch' },
  { abbr: 'RPM', name: 'Revolutions Per Minute' },
  { abbr: 'SG', name: 'Specific Gravity' },
  { abbr: 'TVD', name: 'True Vertical Depth' },
];

export const FIELD_CONSTANTS: [string, string][] = [
  ['1 BBL', '42 GAL = 9,702 in³ = 5.6146 ft³ = 0.15899 m³'],
  ['1 GAL', '231 in³ = 0.1337 ft³ = 0.0238 bbl = 0.00379 m³'],
  ['1 FT³', '7.48 gal = 1,728 in³ = 0.1781 bbl = 0.0283 m³'],
  ['1 m³', '264.17 gal = 6.2898 bbl = 35.315 ft³'],
  ['1 lb / 1 kg', '1 lb = 0.4536 kg | 1 kg = 2.2046 lbs'],
  ['Density: 1 ppg', '120.05 kg/m³ | 1 g/ml = 62.428 lb/ft³'],
  ['Concentration: 1 ppt', '0.1198 g/L'],
  ['Frac Gradient', '0.865 psi/ft'],
  ['Water Density', '8.33 ppg'],
  ['Sand SG (std)', '2.65'],
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

export const UNIT_CONVERSIONS_SECTION1 = [
  { unit: 'Barrel', symbol: 'bbl', conv: '42 gal' },
  { unit: 'Barrel', symbol: 'bbl', conv: '9,702 in³' },
  { unit: 'Barrel', symbol: 'bbl', conv: '5.6146 ft³' },
  { unit: 'Barrel', symbol: 'bbl', conv: '0.15899 m³' },
  { unit: 'Cubic Feet', symbol: 'ft³', conv: '7.48 gal' },
  { unit: 'Cubic Feet', symbol: 'ft³', conv: '1,728 in³' },
  { unit: 'Cubic Feet', symbol: 'ft³', conv: '0.1781 bbl' },
  { unit: 'Cubic Feet', symbol: 'ft³', conv: '0.0283 m³' },
  { unit: 'Feet', symbol: 'ft', conv: '12 in' },
  { unit: 'Density', symbol: 'lbs/gal', conv: '120.05 kg/m³' },
  { unit: 'Density', symbol: 'g/ml', conv: '62.428 lb/ft³' },
  { unit: 'Density', symbol: 'kg/m³', conv: '0.00833 lbs/gal' },
  { unit: 'Concentration', symbol: 'ppt', conv: '0.1198 g/L' },
  { unit: 'Gallon', symbol: 'gal', conv: '231 in³' },
  { unit: 'Gallon', symbol: 'gal', conv: '0.1337 ft³' },
  { unit: 'Gallon', symbol: 'gal', conv: '0.0238 bbl' },
  { unit: 'Gallon', symbol: 'gal', conv: '0.00379 m³' },
  { unit: 'Cubic Inch', symbol: 'in³', conv: '0.0043 gal' },
  { unit: 'Cubic Inch', symbol: 'in³', conv: '0.00058 ft³' },
  { unit: 'Cubic Inch', symbol: 'in³', conv: '0.000103 bbl' },
  { unit: 'Cubic Meter', symbol: 'm³', conv: '264.17 gal' },
  { unit: 'Cubic Meter', symbol: 'm³', conv: '6.2898 bbl' },
  { unit: 'Cubic Meter', symbol: 'm³', conv: '35.315 ft³' },
  { unit: 'Weight', symbol: 'lb', conv: '0.45359 kg' },
  { unit: 'Weight', symbol: 'kg', conv: '2.2046 lbs' },
];

export const HOSE_FACTORS: Record<string, number> = {
  '1': 0.0408,
  '2': 0.1632,
  '4': 0.6528,
  '8': 2.61,
};

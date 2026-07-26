export type TabId =
  | 'dashboard'
  | 'math'
  | 'sand'
  | 'chem'
  | 'hydration'
  | 'blender'
  | 'lime'
  | 'wellbore'
  | 'hp';

export type CompanyProfileId = 'default' | 'amped' | 'liberty';

export const TABS: { id: TabId; label: string }[] = [
  { id: 'dashboard', label: 'Home' },
  { id: 'math', label: 'Math' },
  { id: 'sand', label: 'Sand' },
  { id: 'chem', label: 'Chem' },
  { id: 'hydration', label: 'Hydration' },
  { id: 'blender', label: 'Blender' },
  { id: 'lime', label: 'LIME' },
  { id: 'wellbore', label: 'Wellbore' },
  { id: 'hp', label: 'HP' },
];

export const NAV_ICON_SRC: Partial<Record<TabId, string>> = {
  math: '/Math-icon.jpg',
  sand: '/Sand-icon.jpg',
  chem: '/Chem-icon.jpg',
  hydration: '/Hydration-icon.jpg',
  blender: '/Blender-icon.jpg',
  lime: '/Lime-icon.jpg',
  wellbore: '/Wellbore-icon.jpg',
  hp: '/Horsepower.jpg',
};

export const DASH_CARDS: {
  id: Exclude<TabId, 'dashboard'>;
  label: string;
  bg: string;
  tc: string;
}[] = [
  { id: 'math', label: 'Math', bg: '#dbeafe', tc: '#1e40af' },
  { id: 'sand', label: 'Sand', bg: '#fef3c7', tc: '#92400e' },
  { id: 'chem', label: 'Chem', bg: '#d1fae5', tc: '#065f46' },
  { id: 'hydration', label: 'Hydration', bg: '#e0e7ff', tc: '#3730a3' },
  { id: 'blender', label: 'Blender', bg: '#ede9fe', tc: '#5b21b6' },
  { id: 'lime', label: 'LIME', bg: '#fce7f3', tc: '#9d174d' },
  { id: 'wellbore', label: 'Wellbore', bg: '#e5e7eb', tc: '#374151' },
  { id: 'hp', label: 'Horsepower', bg: '#d1fae5', tc: '#065f46' },
];

export const TAB_LABELS: Record<string, string> = {
  math: 'Math',
  sand: 'Sand',
  chem: 'Chem',
  hydration: 'Hydration',
  blender: 'Blender',
  lime: 'LIME',
  wellbore: 'Wellbore',
  hp: 'Horsepower',
  dashboard: 'Home',
};

export type CompanyProfile = {
  id: CompanyProfileId;
  name: string;
  short: string;
  logo: string | null;
  green: string;
  blue: string;
};

export const COMPANY_PROFILES: Record<CompanyProfileId, CompanyProfile> = {
  default: {
    id: 'default',
    name: 'Default',
    short: 'No logo · black text · grey accents',
    logo: null,
    green: '#6C6C70',
    blue: '#1C1C1E',
  },
  amped: {
    id: 'amped',
    name: 'Amped Energy Solutions',
    short: 'Green titles/labels · blue buttons, fields & results',
    logo: '/new-amped-logo.png',
    green: '#2DC76D',
    blue: '#2D7AC7',
  },
  liberty: {
    id: 'liberty',
    name: 'Liberty Energy',
    short: 'Red titles/buttons · black numbers',
    logo: '/liberty-logo.png',
    green: '#E32400',
    blue: '#1C1C1E',
  },
};

export const PROFILE_ORDER: CompanyProfileId[] = ['default', 'amped', 'liberty'];

export const SETTINGS_KEY = 'ampdFrac_settings_v2';
export const FAVORITES_KEY = 'ampdFrac_favorites_v1';
export const APP_STATE_KEY = 'ampdFrac_v3';

export const DEFAULT_PROFILE_ID: CompanyProfileId = 'default';

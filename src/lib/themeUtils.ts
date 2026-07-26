import type { CompanyProfileId } from './constants';
import { COMPANY_PROFILES } from './constants';

/** Chrome appearance — independent of company brand colors */
export type ColorMode = 'light' | 'dark' | 'system';

export function normalizeHex(hex: string | null | undefined): string | null {
  if (!hex) return null;
  let h = String(hex).trim();
  if (!h.startsWith('#')) h = `#${h}`;
  if (/^#[0-9A-Fa-f]{3}$/.test(h)) {
    h = `#${h[1]}${h[1]}${h[2]}${h[2]}${h[3]}${h[3]}`;
  }
  if (!/^#[0-9A-Fa-f]{6}$/.test(h)) return null;
  return h.toUpperCase();
}

export function hexToRgb(hex: string) {
  const h = normalizeHex(hex);
  if (!h) return null;
  return {
    r: parseInt(h.slice(1, 3), 16),
    g: parseInt(h.slice(3, 5), 16),
    b: parseInt(h.slice(5, 7), 16),
  };
}

export function rgbaFromHex(hex: string, a: number) {
  const rgb = hexToRgb(hex);
  if (!rgb) return `rgba(0,0,0,${a})`;
  return `rgba(${rgb.r},${rgb.g},${rgb.b},${a})`;
}

export function darkenHex(hex: string, factor = 0.85) {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;
  const d = (n: number) => Math.max(0, Math.min(255, Math.round(n * factor)));
  return (
    '#' +
    [d(rgb.r), d(rgb.g), d(rgb.b)]
      .map((n) => n.toString(16).padStart(2, '0'))
      .join('')
      .toUpperCase()
  );
}

export function lightenHex(hex: string, factor = 0.35) {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;
  const l = (n: number) =>
    Math.max(0, Math.min(255, Math.round(n + (255 - n) * factor)));
  return (
    '#' +
    [l(rgb.r), l(rgb.g), l(rgb.b)]
      .map((n) => n.toString(16).padStart(2, '0'))
      .join('')
      .toUpperCase()
  );
}

/** Relative luminance 0–1 (sRGB) */
export function relativeLuminance(hex: string): number {
  const rgb = hexToRgb(hex);
  if (!rgb) return 0;
  const lin = (c: number) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * lin(rgb.r) + 0.7152 * lin(rgb.g) + 0.0722 * lin(rgb.b);
}

/**
 * Keep brand text/number colors readable on light vs dark chrome
 * without changing the user's stored profile hex values.
 */
export function contrastSafe(hex: string, darkChrome: boolean): string {
  const n = normalizeHex(hex) || hex;
  const L = relativeLuminance(n);
  if (darkChrome) {
    // Near-black / dark grey → lift so it stays visible on dark surfaces
    if (L < 0.22) return lightenHex(n, 0.72);
    if (L < 0.35) return lightenHex(n, 0.45);
    return n;
  }
  // Near-white → darken slightly for light surfaces
  if (L > 0.88) return darkenHex(n, 0.55);
  return n;
}

export function resolveColorMode(mode: ColorMode): 'light' | 'dark' {
  if (mode === 'light') return 'light';
  if (mode === 'dark') return 'dark';
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  }
  return 'light';
}

export type ThemeState = {
  profileId: CompanyProfileId;
  logoDataUrl: string | null;
  green: string;
  blue: string;
  /** UI chrome: light / dark / follow OS */
  colorMode: ColorMode;
};

const LIGHT_CHROME = {
  bg: '#F2F2F7',
  card: '#FFFFFF',
  border: '#E5E5EA',
  surface: '#F2F2F7',
  surface2: '#EBEBF0',
  text: '#1C1C1E',
  text2: '#6C6C70',
  text3: '#AEAEB2',
  shadow: 'rgba(0,0,0,0.07)',
  shadowMd: 'rgba(0,0,0,0.12)',
  overlay: 'rgba(0,0,0,0.35)',
  hairline: 'rgba(0,0,0,0.06)',
};

const DARK_CHROME = {
  bg: '#0B0B0F',
  card: '#1C1C22',
  border: '#2C2C34',
  surface: '#16161C',
  surface2: '#22222A',
  text: '#F5F5F7',
  text2: '#A1A1AA',
  text3: '#71717A',
  shadow: 'rgba(0,0,0,0.45)',
  shadowMd: 'rgba(0,0,0,0.55)',
  overlay: 'rgba(0,0,0,0.55)',
  hairline: 'rgba(255,255,255,0.08)',
};

export function applyChromeToDocument(resolved: 'light' | 'dark') {
  const root = document.documentElement;
  const c = resolved === 'dark' ? DARK_CHROME : LIGHT_CHROME;
  root.dataset.theme = resolved;
  root.style.colorScheme = resolved;
  root.style.setProperty('--bg', c.bg);
  root.style.setProperty('--card', c.card);
  root.style.setProperty('--border', c.border);
  root.style.setProperty('--surface', c.surface);
  root.style.setProperty('--surface2', c.surface2);
  root.style.setProperty('--text', c.text);
  root.style.setProperty('--text2', c.text2);
  root.style.setProperty('--text3', c.text3);
  root.style.setProperty('--shadow', c.shadow);
  root.style.setProperty('--shadow-md', c.shadowMd);
  root.style.setProperty('--overlay', c.overlay);
  root.style.setProperty('--hairline', c.hairline);
}

export function applyBrandToDocument(
  theme: Pick<ThemeState, 'profileId' | 'green' | 'blue'>,
  darkChrome: boolean,
) {
  const root = document.documentElement;
  const profile = COMPANY_PROFILES[theme.profileId] || COMPANY_PROFILES.default;
  const green = normalizeHex(theme.green) || profile.green;
  const blue = normalizeHex(theme.blue) || profile.blue;

  // Stored brand colors (for color pickers / reset comparison)
  root.style.setProperty('--brand-green-raw', green);
  root.style.setProperty('--brand-blue-raw', blue);

  // Readable variants for UI chrome (dark mode may lift near-black)
  const greenUi = contrastSafe(green, darkChrome);
  const blueUi = contrastSafe(blue, darkChrome);

  const brandAccentRaw = theme.profileId === 'amped' ? blue : green;
  const brandAccent = contrastSafe(brandAccentRaw, darkChrome);

  root.style.setProperty('--brand', brandAccent);
  root.style.setProperty(
    '--brand-hover',
    darkChrome ? lightenHex(brandAccent, 0.12) : darkenHex(brandAccent, 0.85),
  );
  root.style.setProperty('--brand-dim', rgbaFromHex(brandAccent, darkChrome ? 0.22 : 0.12));
  root.style.setProperty('--brand-dim2', rgbaFromHex(brandAccent, darkChrome ? 0.14 : 0.06));
  root.style.setProperty('--brand-shadow', rgbaFromHex(brandAccent, darkChrome ? 0.45 : 0.3));
  root.style.setProperty('--brand-blue', blueUi);
  root.style.setProperty('--brand-blue-dim', rgbaFromHex(blueUi, darkChrome ? 0.22 : 0.12));
  root.style.setProperty('--blue', blueUi);

  let titleColor = greenUi;
  let labelColor = greenUi;
  let numberColor = blueUi;

  if (theme.profileId === 'amped') {
    titleColor = greenUi;
    labelColor = greenUi;
    numberColor = blueUi;
  } else if (theme.profileId === 'default') {
    titleColor = blueUi;
    labelColor = blueUi;
    numberColor = blueUi;
  } else {
    // Liberty: red titles/buttons, black (or custom) numbers
    titleColor = greenUi;
    labelColor = greenUi;
    numberColor = blueUi;
  }

  root.style.setProperty('--title-color', titleColor);
  root.style.setProperty('--label-color', labelColor);
  root.style.setProperty('--field-value-color', numberColor);
  root.style.setProperty('--number-color', numberColor);

  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) {
    meta.setAttribute(
      'content',
      darkChrome ? DARK_CHROME.bg : brandAccent,
    );
  }
}

export function applyThemeToDocument(theme: ThemeState) {
  const resolved = resolveColorMode(theme.colorMode);
  applyChromeToDocument(resolved);
  applyBrandToDocument(theme, resolved === 'dark');
}

export function resolveLogoSrc(theme: ThemeState): string | null {
  if (theme.logoDataUrl) return theme.logoDataUrl;
  return COMPANY_PROFILES[theme.profileId]?.logo ?? null;
}

export function profileDefaultColors(profileId: CompanyProfileId) {
  const p = COMPANY_PROFILES[profileId] || COMPANY_PROFILES.default;
  return {
    green: normalizeHex(p.green) || p.green,
    blue: normalizeHex(p.blue) || p.blue,
  };
}

export function getColorRoleCopy(profileId: CompanyProfileId, name: string) {
  if (profileId === 'amped') {
    return {
      note: `Active profile: ${name}. Color A and Color B control brand roles. Light/dark mode only changes page chrome (backgrounds & text).`,
      greenLabel: 'Color A — titles & labels',
      greenHelp:
        'Changes: page titles, tool card titles, field labels, and section subtitles.',
      blueLabel: 'Color B — numbers, buttons & results',
      blueHelp:
        'Changes: all numbers in input fields, calculator result values, primary buttons, toggles, progress bars, and focus highlights.',
      footer:
        'Reset restores this profile’s brand colors. Appearance (light/dark) is unchanged.',
    };
  }
  if (profileId === 'liberty') {
    return {
      note: `Active profile: ${name}. Color A is Liberty red; Color B defaults to black for numbers (auto-lifted in dark mode for readability).`,
      greenLabel: 'Color A — titles, labels & buttons',
      greenHelp:
        'Changes: page titles, tool titles, field labels, primary buttons, toggles, and focus highlights.',
      blueLabel: 'Color B — numbers & results',
      blueHelp:
        'Changes: all numbers typed in fields and calculator result values. Default is black (#1C1C1E).',
      footer:
        'Reset restores Color A to Liberty red (#E32400) and Color B to black (#1C1C1E).',
    };
  }
  return {
    note: `Active profile: ${name}. Neutral brand colors — light/dark mode handles the shell independently.`,
    greenLabel: 'Color A — titles, labels & buttons',
    greenHelp:
      'Changes: page titles, tool titles, field labels, primary buttons, toggles, and focus highlights.',
    blueLabel: 'Color B — numbers & results',
    blueHelp:
      'Changes: all numbers typed in fields and calculator result values.',
    footer:
      "Reset restores this profile's default brand colors. Logo and appearance stay as set.",
  };
}

export async function fileToLogoDataUrl(file: File): Promise<string> {
  if (file.type === 'image/svg+xml' || file.size < 180000) {
    return await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = () => reject(new Error('read failed'));
      reader.readAsDataURL(file);
    });
  }
  return resizeImageToDataUrl(file);
}

function resizeImageToDataUrl(file: File, maxEdge = 900, quality = 0.88) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Could not read file'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('Invalid image'));
      img.onload = () => {
        let { width, height } = img;
        const scale = Math.min(1, maxEdge / Math.max(width, height));
        width = Math.max(1, Math.round(width * scale));
        height = Math.max(1, Math.round(height * scale));
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(String(reader.result));
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        const isPng = file.type === 'image/png' || file.type === 'image/svg+xml';
        try {
          resolve(
            isPng
              ? canvas.toDataURL('image/png')
              : canvas.toDataURL('image/jpeg', quality),
          );
        } catch {
          resolve(String(reader.result));
        }
      };
      img.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  });
}

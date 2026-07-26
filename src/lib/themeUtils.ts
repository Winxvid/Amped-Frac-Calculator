import type { CompanyProfileId } from './constants';
import { COMPANY_PROFILES } from './constants';

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

export type ThemeState = {
  profileId: CompanyProfileId;
  logoDataUrl: string | null;
  green: string;
  blue: string;
};

export function applyThemeToDocument(theme: ThemeState) {
  const root = document.documentElement;
  const profile = COMPANY_PROFILES[theme.profileId] || COMPANY_PROFILES.default;
  const green = normalizeHex(theme.green) || profile.green;
  const blue = normalizeHex(theme.blue) || profile.blue;

  const brandAccent = theme.profileId === 'amped' ? blue : green;

  root.style.setProperty('--brand', brandAccent);
  root.style.setProperty('--brand-hover', darkenHex(brandAccent, 0.85));
  root.style.setProperty('--brand-dim', rgbaFromHex(brandAccent, 0.12));
  root.style.setProperty('--brand-dim2', rgbaFromHex(brandAccent, 0.06));
  root.style.setProperty('--brand-shadow', rgbaFromHex(brandAccent, 0.30));
  root.style.setProperty('--brand-blue', blue);
  root.style.setProperty('--brand-blue-dim', rgbaFromHex(blue, 0.12));
  root.style.setProperty('--blue', blue);

  let numberColor = blue;
  if (theme.profileId === 'amped') {
    root.style.setProperty('--title-color', green);
    root.style.setProperty('--label-color', green);
    numberColor = blue;
  } else if (theme.profileId === 'default') {
    root.style.setProperty('--title-color', blue);
    root.style.setProperty('--label-color', blue);
    numberColor = blue;
  } else {
    root.style.setProperty('--title-color', green);
    root.style.setProperty('--label-color', green);
    numberColor = blue;
  }
  root.style.setProperty('--field-value-color', numberColor);
  root.style.setProperty('--number-color', numberColor);

  // Keep theme-color meta in sync (mobile browser chrome)
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', brandAccent);
}

export function resolveLogoSrc(theme: ThemeState): string | null {
  if (theme.logoDataUrl) return theme.logoDataUrl;
  return COMPANY_PROFILES[theme.profileId]?.logo ?? null;
}

export function getColorRoleCopy(profileId: CompanyProfileId, name: string) {
  if (profileId === 'amped') {
    return {
      note: `Active profile: ${name}. Color A and Color B control different parts of the UI.`,
      greenLabel: 'Color A — titles & labels',
      greenHelp:
        'Changes: page titles, tool card titles, field labels, and section subtitles.',
      blueLabel: 'Color B — numbers, buttons & results',
      blueHelp:
        'Changes: all numbers in input fields, calculator result values, primary buttons, toggles, progress bars, and focus highlights.',
      footer:
        'Amped uses two roles: Color A for text headings/labels, Color B for interactive accents and every numeric value.',
    };
  }
  if (profileId === 'liberty') {
    return {
      note: `Active profile: ${name}. Color A is Liberty red; Color B defaults to black for numbers.`,
      greenLabel: 'Color A — titles, labels & buttons',
      greenHelp:
        'Changes: page titles, tool titles, field labels, primary buttons, toggles, and focus highlights.',
      blueLabel: 'Color B — numbers & results',
      blueHelp:
        'Changes: all numbers typed in fields and calculator result values (including decimals). Default is black (#1C1C1E).',
      footer:
        'Reset restores Color A to Liberty red (#E32400) and Color B to black (#1C1C1E).',
    };
  }
  return {
    note: `Active profile: ${name}. Neutral theme — both colors default to black/grey for a clean, unbranded look.`,
    greenLabel: 'Color A — titles, labels & buttons',
    greenHelp:
      'Changes: page titles, tool titles, field labels, primary buttons, toggles, and focus highlights.',
    blueLabel: 'Color B — numbers & results',
    blueHelp:
      'Changes: all numbers typed in fields and calculator result values (including decimals).',
    footer:
      "Reset restores this profile's default neutral colors. Logo stays off unless you upload one.",
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

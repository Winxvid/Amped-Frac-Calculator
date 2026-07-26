import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
  COMPANY_PROFILES,
  DEFAULT_PROFILE_ID,
  SETTINGS_KEY,
  type CompanyProfileId,
} from '../lib/constants';
import {
  applyThemeToDocument,
  fileToLogoDataUrl,
  normalizeHex,
  resolveLogoSrc,
  type ThemeState,
} from '../lib/themeUtils';

type ThemeContextValue = {
  theme: ThemeState;
  logoSrc: string | null;
  selectProfile: (id: CompanyProfileId) => void;
  setColor: (which: 'green' | 'blue', hex: string) => void;
  resetColors: () => void;
  setCustomLogo: (dataUrl: string | null) => void;
  uploadLogo: (file: File) => Promise<void>;
  resetLogo: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

function loadTheme(): ThemeState {
  const base: ThemeState = {
    profileId: DEFAULT_PROFILE_ID,
    logoDataUrl: null,
    green: COMPANY_PROFILES.default.green,
    blue: COMPANY_PROFILES.default.blue,
  };
  try {
    let raw = localStorage.getItem(SETTINGS_KEY);
    let data = raw ? JSON.parse(raw) : null;
    if (!data) {
      const legacy = localStorage.getItem('ampdFrac_settings_v1');
      if (legacy) data = JSON.parse(legacy);
    }
    if (!data) return base;

    if (data.profileId && COMPANY_PROFILES[data.profileId as CompanyProfileId]) {
      base.profileId = data.profileId as CompanyProfileId;
    } else if (!data.profileId && (data.green || data.blue || data.logoDataUrl)) {
      base.profileId = 'amped';
    }
    if (data.logoDataUrl) base.logoDataUrl = data.logoDataUrl;
    if (normalizeHex(data.green)) base.green = normalizeHex(data.green)!;
    if (normalizeHex(data.blue)) base.blue = normalizeHex(data.blue)!;
    // If profile selected but colors never customized, use profile defaults when missing
    const p = COMPANY_PROFILES[base.profileId];
    if (!data.green) base.green = p.green;
    if (!data.blue) base.blue = p.blue;
  } catch {
    /* ignore */
  }
  return base;
}

function persistTheme(theme: ThemeState) {
  try {
    localStorage.setItem(
      SETTINGS_KEY,
      JSON.stringify({
        profileId: theme.profileId,
        logoDataUrl: theme.logoDataUrl,
        green: theme.green,
        blue: theme.blue,
      }),
    );
  } catch {
    try {
      localStorage.setItem(
        SETTINGS_KEY,
        JSON.stringify({
          profileId: theme.profileId,
          logoDataUrl: null,
          green: theme.green,
          blue: theme.blue,
        }),
      );
      alert(
        'Logo is too large to save in this browser. Profile and colors were saved; try a smaller image.',
      );
    } catch {
      /* ignore */
    }
  }
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<ThemeState>(() => loadTheme());

  useEffect(() => {
    applyThemeToDocument(theme);
    persistTheme(theme);
  }, [theme]);

  const selectProfile = useCallback((id: CompanyProfileId) => {
    const p = COMPANY_PROFILES[id];
    if (!p) return;
    setTheme({
      profileId: id,
      logoDataUrl: null,
      green: p.green,
      blue: p.blue,
    });
  }, []);

  const setColor = useCallback((which: 'green' | 'blue', hex: string) => {
    const n = normalizeHex(hex);
    if (!n) return;
    setTheme((t) => ({ ...t, [which]: n }));
  }, []);

  const resetColors = useCallback(() => {
    setTheme((t) => {
      const p = COMPANY_PROFILES[t.profileId];
      return { ...t, green: p.green, blue: p.blue };
    });
  }, []);

  const setCustomLogo = useCallback((dataUrl: string | null) => {
    setTheme((t) => ({ ...t, logoDataUrl: dataUrl }));
  }, []);

  const uploadLogo = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please choose an image file (PNG, JPG, etc.).');
      return;
    }
    try {
      const dataUrl = await fileToLogoDataUrl(file);
      setTheme((t) => ({ ...t, logoDataUrl: dataUrl }));
    } catch {
      alert('Could not load that image. Try another file.');
    }
  }, []);

  const resetLogo = useCallback(() => {
    setTheme((t) => ({ ...t, logoDataUrl: null }));
  }, []);

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme,
      logoSrc: resolveLogoSrc(theme),
      selectProfile,
      setColor,
      resetColors,
      setCustomLogo,
      uploadLogo,
      resetLogo,
    }),
    [theme, selectProfile, setColor, resetColors, setCustomLogo, uploadLogo, resetLogo],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}

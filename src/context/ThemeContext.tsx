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
  profileDefaultColors,
  resolveColorMode,
  resolveLogoSrc,
  type ColorMode,
  type ThemeState,
  type UserProfile,
} from '../lib/themeUtils';

export type CompleteOnboardingInput = {
  displayName: string;
  companyName: string;
  /** Built-in profile when company matched; null = custom / default path */
  matchedProfileId: CompanyProfileId | null;
  /** Custom colors (only used when no match, or override) */
  green?: string;
  blue?: string;
  logoDataUrl?: string | null;
  /** If true and no match, force default colors even if green/blue passed */
  useDefaultColors?: boolean;
};

type ThemeContextValue = {
  theme: ThemeState;
  logoSrc: string | null;
  resolvedMode: 'light' | 'dark';
  needsOnboarding: boolean;
  selectProfile: (id: CompanyProfileId) => void;
  setColor: (which: 'green' | 'blue', hex: string) => void;
  resetColors: () => void;
  setColorMode: (mode: ColorMode) => void;
  toggleLightDark: () => void;
  setCustomLogo: (dataUrl: string | null) => void;
  uploadLogo: (file: File) => Promise<void>;
  resetLogo: () => void;
  completeOnboarding: (input: CompleteOnboardingInput) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

function loadTheme(): ThemeState {
  const defaults = profileDefaultColors(DEFAULT_PROFILE_ID);
  const base: ThemeState = {
    profileId: DEFAULT_PROFILE_ID,
    logoDataUrl: null,
    green: defaults.green,
    blue: defaults.blue,
    colorMode: 'system',
    onboardingComplete: false,
    user: null,
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
    const p = profileDefaultColors(base.profileId);
    if (!data.green) base.green = p.green;
    if (!data.blue) base.blue = p.blue;

    if (data.colorMode === 'light' || data.colorMode === 'dark' || data.colorMode === 'system') {
      base.colorMode = data.colorMode;
    } else if (data.darkMode === true) {
      base.colorMode = 'dark';
    } else if (data.darkMode === false) {
      base.colorMode = 'light';
    }

    if (data.user && typeof data.user.displayName === 'string') {
      base.user = {
        displayName: String(data.user.displayName || '').trim(),
        companyName: String(data.user.companyName || '').trim(),
      };
    }

    if (data.onboardingComplete === true) {
      base.onboardingComplete = true;
    } else if (data.onboardingComplete === false) {
      base.onboardingComplete = false;
    } else {
      // Migration: existing installs with saved settings skip welcome
      const hadPriorUse =
        Boolean(data.profileId) ||
        Boolean(data.logoDataUrl) ||
        Boolean(data.green) ||
        Boolean(data.blue) ||
        Boolean(data.colorMode) ||
        Boolean(data.user);
      base.onboardingComplete = hadPriorUse;
    }
  } catch {
    /* ignore */
  }
  return base;
}

function persistTheme(theme: ThemeState) {
  const payload = {
    profileId: theme.profileId,
    logoDataUrl: theme.logoDataUrl,
    green: theme.green,
    blue: theme.blue,
    colorMode: theme.colorMode,
    onboardingComplete: theme.onboardingComplete,
    user: theme.user,
  };
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(payload));
  } catch {
    try {
      localStorage.setItem(
        SETTINGS_KEY,
        JSON.stringify({ ...payload, logoDataUrl: null }),
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
  const [systemDark, setSystemDark] = useState(() =>
    typeof window !== 'undefined' && window.matchMedia
      ? window.matchMedia('(prefers-color-scheme: dark)').matches
      : false,
  );

  const resolvedMode = useMemo(() => {
    if (theme.colorMode === 'system') {
      return systemDark ? 'dark' : 'light';
    }
    return theme.colorMode;
  }, [theme.colorMode, systemDark]);

  useEffect(() => {
    const modeForApply =
      theme.colorMode === 'system'
        ? systemDark
          ? 'dark'
          : 'light'
        : theme.colorMode;
    applyThemeToDocument({ ...theme, colorMode: modeForApply });
    persistTheme(theme);
  }, [theme, systemDark]);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = (e: MediaQueryListEvent) => setSystemDark(e.matches);
    setSystemDark(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const selectProfile = useCallback((id: CompanyProfileId) => {
    const p = COMPANY_PROFILES[id];
    if (!p) return;
    const colors = profileDefaultColors(id);
    setTheme((t) => ({
      ...t,
      profileId: id,
      logoDataUrl: null,
      green: colors.green,
      blue: colors.blue,
    }));
  }, []);

  const setColor = useCallback((which: 'green' | 'blue', hex: string) => {
    const n = normalizeHex(hex);
    if (!n) return;
    setTheme((t) => ({ ...t, [which]: n }));
  }, []);

  const resetColors = useCallback(() => {
    setTheme((t) => {
      const colors = profileDefaultColors(t.profileId);
      return {
        ...t,
        green: colors.green,
        blue: colors.blue,
      };
    });
  }, []);

  const setColorMode = useCallback((mode: ColorMode) => {
    setTheme((t) => ({ ...t, colorMode: mode }));
  }, []);

  const toggleLightDark = useCallback(() => {
    setTheme((t) => {
      const current = resolveColorMode(t.colorMode);
      return { ...t, colorMode: current === 'dark' ? 'light' : 'dark' };
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

  const completeOnboarding = useCallback((input: CompleteOnboardingInput) => {
    const displayName = String(input.displayName || '').trim();
    const companyName = String(input.companyName || '').trim();
    if (!displayName || !companyName) return;

    const user: UserProfile = { displayName, companyName };

    if (input.matchedProfileId && COMPANY_PROFILES[input.matchedProfileId]) {
      const id = input.matchedProfileId;
      const colors = profileDefaultColors(id);
      setTheme((t) => ({
        ...t,
        user,
        onboardingComplete: true,
        profileId: id,
        logoDataUrl: null,
        green: colors.green,
        blue: colors.blue,
      }));
      return;
    }

    // Custom / unmatched company → Default base + optional logo/colors
    const def = profileDefaultColors(DEFAULT_PROFILE_ID);
    const green =
      !input.useDefaultColors && normalizeHex(input.green || '')
        ? normalizeHex(input.green!)!
        : def.green;
    const blue =
      !input.useDefaultColors && normalizeHex(input.blue || '')
        ? normalizeHex(input.blue!)!
        : def.blue;
    const logoDataUrl =
      typeof input.logoDataUrl === 'string' && input.logoDataUrl
        ? input.logoDataUrl
        : null;

    setTheme((t) => ({
      ...t,
      user,
      onboardingComplete: true,
      profileId: DEFAULT_PROFILE_ID,
      green,
      blue,
      logoDataUrl,
    }));
  }, []);

  const needsOnboarding = !theme.onboardingComplete;

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme,
      logoSrc: resolveLogoSrc(theme),
      resolvedMode,
      needsOnboarding,
      selectProfile,
      setColor,
      resetColors,
      setColorMode,
      toggleLightDark,
      setCustomLogo,
      uploadLogo,
      resetLogo,
      completeOnboarding,
    }),
    [
      theme,
      resolvedMode,
      needsOnboarding,
      selectProfile,
      setColor,
      resetColors,
      setColorMode,
      toggleLightDark,
      setCustomLogo,
      uploadLogo,
      resetLogo,
      completeOnboarding,
    ],
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

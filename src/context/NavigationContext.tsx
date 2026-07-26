import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { APP_STATE_KEY, type TabId } from '../lib/constants';

type NavigationContextValue = {
  tab: TabId;
  menuOpen: boolean;
  settingsOpen: boolean;
  navigate: (tab: TabId) => void;
  openMenu: () => void;
  closeMenu: () => void;
  openSettings: () => void;
  closeSettings: () => void;
  openFavoriteTool: (toolId: string, tab: string) => void;
};

const NavigationContext = createContext<NavigationContextValue | null>(null);

function loadInitialTab(): TabId {
  try {
    const raw = localStorage.getItem(APP_STATE_KEY);
    if (!raw) return 'dashboard';
    const data = JSON.parse(raw);
    if (data?.tab && typeof data.tab === 'string') return data.tab as TabId;
  } catch {
    /* ignore */
  }
  return 'dashboard';
}

function applySectionVisibility(tab: TabId) {
  document.querySelectorAll('.section').forEach((s) => s.classList.remove('active'));
  const el = document.getElementById(`s-${tab}`);
  if (el) el.classList.add('active');
  window.scrollTo(0, 0);
  // Keep legacy state in sync if engine loaded
  window.__ampedLegacySetTab?.(tab);
}

export function NavigationProvider({ children }: { children: ReactNode }) {
  const [tab, setTab] = useState<TabId>(() => loadInitialTab());
  const [menuOpen, setMenuOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const navigate = useCallback((next: TabId) => {
    setTab(next);
    setMenuOpen(false);
    applySectionVisibility(next);
    try {
      const raw = localStorage.getItem(APP_STATE_KEY);
      const data = raw ? JSON.parse(raw) : {};
      data.tab = next;
      localStorage.setItem(APP_STATE_KEY, JSON.stringify(data));
    } catch {
      /* ignore */
    }
  }, []);

  // Re-apply visibility after calculator host mounts
  useEffect(() => {
    applySectionVisibility(tab);
  }, [tab]);

  // Legacy engine may call navigate via bridge
  useEffect(() => {
    window.__ampedReactNavigate = (t: string) => navigate(t as TabId);
    return () => {
      delete window.__ampedReactNavigate;
    };
  }, [navigate]);

  const openMenu = useCallback(() => {
    setSettingsOpen(false);
    setMenuOpen(true);
  }, []);
  const closeMenu = useCallback(() => setMenuOpen(false), []);
  const openSettings = useCallback(() => {
    setMenuOpen(false);
    setSettingsOpen(true);
  }, []);
  const closeSettings = useCallback(() => setSettingsOpen(false), []);

  const openFavoriteTool = useCallback(
    (toolId: string, toolTab: string) => {
      navigate(toolTab as TabId);
      requestAnimationFrame(() => {
        setTimeout(() => {
          const safe =
            typeof CSS !== 'undefined' && CSS.escape
              ? CSS.escape(toolId)
              : toolId.replace(/"/g, '\\"');
          const el = document.querySelector(
            `.card[data-tool-id="${safe}"], .card-sm[data-tool-id="${safe}"]`,
          ) as HTMLElement | null;
          if (!el) return;
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          el.classList.add('tool-highlight');
          setTimeout(() => el.classList.remove('tool-highlight'), 1600);
        }, 50);
      });
    },
    [navigate],
  );

  const value = useMemo(
    () => ({
      tab,
      menuOpen,
      settingsOpen,
      navigate,
      openMenu,
      closeMenu,
      openSettings,
      closeSettings,
      openFavoriteTool,
    }),
    [
      tab,
      menuOpen,
      settingsOpen,
      navigate,
      openMenu,
      closeMenu,
      openSettings,
      closeSettings,
      openFavoriteTool,
    ],
  );

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  const ctx = useContext(NavigationContext);
  if (!ctx) throw new Error('useNavigation must be used within NavigationProvider');
  return ctx;
}

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { FAVORITES_KEY } from '../lib/constants';

export type FavoriteItem = {
  id: string;
  label: string;
  tab: string;
};

type FavoritesContextValue = {
  favorites: FavoriteItem[];
  isFavorite: (id: string) => boolean;
  toggleFavorite: (id: string, label: string, tab: string) => void;
  removeFavorite: (id: string) => void;
};

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

function loadFavorites(): FavoriteItem[] {
  try {
    const raw = localStorage.getItem(FAVORITES_KEY);
    if (!raw) return [];
    const data = JSON.parse(raw);
    if (!Array.isArray(data)) return [];
    return data.filter((f) => f && f.id && f.label && f.tab);
  } catch {
    return [];
  }
}

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<FavoriteItem[]>(() => loadFavorites());

  useEffect(() => {
    try {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    } catch {
      /* ignore */
    }
  }, [favorites]);

  // Bridge for legacy heart buttons in calculator tools
  useEffect(() => {
    window.__ampedFavoritesBridge = {
      isFavorite: (id: string) => favorites.some((f) => f.id === id),
      toggleFavorite: (id: string, label: string, tab: string) => {
        setFavorites((prev) => {
          const idx = prev.findIndex((f) => f.id === id);
          if (idx >= 0) {
            const next = [...prev];
            next.splice(idx, 1);
            return next;
          }
          return [{ id, label, tab }, ...prev];
        });
      },
      getFavorites: () => favorites,
    };
    // Re-sync heart UI after React favorites change
    window.dispatchEvent(new CustomEvent('amped:favorites-changed'));
    return () => {
      delete window.__ampedFavoritesBridge;
    };
  }, [favorites]);

  const isFavorite = useCallback(
    (id: string) => favorites.some((f) => f.id === id),
    [favorites],
  );

  const toggleFavorite = useCallback((id: string, label: string, tab: string) => {
    setFavorites((prev) => {
      const idx = prev.findIndex((f) => f.id === id);
      if (idx >= 0) {
        const next = [...prev];
        next.splice(idx, 1);
        return next;
      }
      return [{ id, label, tab }, ...prev];
    });
  }, []);

  const removeFavorite = useCallback((id: string) => {
    setFavorites((prev) => prev.filter((f) => f.id !== id));
  }, []);

  const value = useMemo(
    () => ({ favorites, isFavorite, toggleFavorite, removeFavorite }),
    [favorites, isFavorite, toggleFavorite, removeFavorite],
  );

  return (
    <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error('useFavorites must be used within FavoritesProvider');
  return ctx;
}

/// <reference types="vite/client" />

declare module '*.html?raw' {
  const content: string;
  export default content;
}

declare module '@/legacy/engine.js' {
  export function initLegacyApp(): void;
  export function resetLegacyInitFlag(): void;
}

interface Window {
  __ampedLegacyInit?: boolean;
  __ampedReactNavigate?: (tab: string) => void;
  __ampedLegacySetTab?: (tab: string) => void;
  __ampedGetCleanRate?: () => number;
  __ampedSetCleanRate?: (n: number) => void;
  __ampedFavoritesBridge?: {
    isFavorite: (id: string) => boolean;
    toggleFavorite: (id: string, label: string, tab: string) => void;
    getFavorites: () => { id: string; label: string; tab: string }[];
  };
}

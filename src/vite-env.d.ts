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
}

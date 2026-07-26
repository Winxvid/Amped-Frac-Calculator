import { useEffect, useRef } from 'react';
import contentHtml from './legacy/content.html?raw';
import { initLegacyApp } from './legacy/engine.js';

/**
 * AmpdFrac React application shell.
 *
 * Phase 1 (current): React mounts the migrated UI and boots the proven
 * calculator engine (favorites, settings, profiles, all tools).
 *
 * Phase 2 (next): lift shell pieces (nav, settings, favorites) into pure
 * React components, then section-by-section calculator rewrites with hooks.
 *
 * Phase 3 (mobile): wrap with Capacitor or share logic with React Native.
 */
export default function App() {
  const booted = useRef(false);

  useEffect(() => {
    if (booted.current) return;
    booted.current = true;

    // Defer one frame so injected markup is in the DOM
    const id = requestAnimationFrame(() => {
      try {
        initLegacyApp();
      } catch (err) {
        console.error(err);
      }
    });

    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <div
      className="amped-app-root"
      // Migrated markup: sidebar, settings, header, all calculator sections
      dangerouslySetInnerHTML={{ __html: contentHtml }}
    />
  );
}

import { useEffect, useRef } from 'react';
import toolsHtml from '../legacy/tools.html?raw';
import { initLegacyApp, resetLegacyInitFlag } from '../legacy/engine.js';

/**
 * Mounts calculator tool sections and boots the legacy engine.
 * Shell (nav / settings / favorites / dashboard) lives in React.
 */
export function CalculatorHost() {
  const ref = useRef<HTMLDivElement>(null);
  const booted = useRef(false);

  useEffect(() => {
    if (booted.current) return;
    booted.current = true;

    const id = requestAnimationFrame(() => {
      try {
        resetLegacyInitFlag();
        initLegacyApp();
      } catch (err) {
        console.error('Calculator engine failed to start', err);
        booted.current = false;
      }
    });

    return () => {
      cancelAnimationFrame(id);
    };
  }, []);

  return (
    <div
      ref={ref}
      className="calculator-host"
      // Tool sections only (s-math … s-hp)
      dangerouslySetInnerHTML={{ __html: toolsHtml }}
    />
  );
}

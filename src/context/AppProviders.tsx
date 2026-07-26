import type { ReactNode } from 'react';

/**
 * Placeholder for React context providers (theme, favorites, app state).
 * Legacy engine still owns localStorage for theme/favorites today;
 * lift those into providers as shell components are rewritten.
 */
export function AppProviders({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

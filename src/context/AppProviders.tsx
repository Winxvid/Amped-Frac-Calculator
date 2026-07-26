import type { ReactNode } from 'react';
import { ThemeProvider } from './ThemeContext';
import { FavoritesProvider } from './FavoritesContext';
import { NavigationProvider } from './NavigationContext';

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <FavoritesProvider>
        <NavigationProvider>{children}</NavigationProvider>
      </FavoritesProvider>
    </ThemeProvider>
  );
}

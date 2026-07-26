import type { ReactNode } from 'react';
import { ThemeProvider } from './ThemeContext';
import { FavoritesProvider } from './FavoritesContext';
import { NavigationProvider } from './NavigationContext';
import { CalcStateProvider } from './CalcStateContext';

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <FavoritesProvider>
        <NavigationProvider>
          <CalcStateProvider>{children}</CalcStateProvider>
        </NavigationProvider>
      </FavoritesProvider>
    </ThemeProvider>
  );
}

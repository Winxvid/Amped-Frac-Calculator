import { AppProviders } from './context/AppProviders';
import { useTheme } from './context/ThemeContext';
import { Header } from './components/shell/Header';
import { Sidebar } from './components/shell/Sidebar';
import { SettingsPanel } from './components/shell/SettingsPanel';
import { Dashboard } from './components/shell/Dashboard';
import { MathPage } from './features/math/MathPage';
import { SandPage } from './features/sand/SandPage';
import { ChemPage } from './features/chem/ChemPage';
import { HydrationPage } from './features/hydration/HydrationPage';
import { BlenderPage } from './features/blender/BlenderPage';
import { LimePage } from './features/lime/LimePage';
import { WellborePage } from './features/wellbore/WellborePage';
import { HpPage } from './features/hp/HpPage';
import { WelcomePage } from './features/welcome/WelcomePage';

function AppShell() {
  return (
    <div className="amped-app-root">
      <Sidebar />
      <SettingsPanel />
      <Header />
      <div className="app-content">
        <Dashboard />
        <MathPage />
        <SandPage />
        <ChemPage />
        <HydrationPage />
        <BlenderPage />
        <LimePage />
        <WellborePage />
        <HpPage />
      </div>
    </div>
  );
}

function AppGate() {
  const { needsOnboarding } = useTheme();
  if (needsOnboarding) return <WelcomePage />;
  return <AppShell />;
}

/**
 * Full React app — first-run welcome gate, then shell + calculator sections.
 */
export default function App() {
  return (
    <AppProviders>
      <AppGate />
    </AppProviders>
  );
}

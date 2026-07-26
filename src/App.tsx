import { AppProviders } from './context/AppProviders';
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

/**
 * Full React app — shell + all calculator sections.
 * Legacy engine/tools host removed in Phase 3.
 */
export default function App() {
  return (
    <AppProviders>
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
    </AppProviders>
  );
}

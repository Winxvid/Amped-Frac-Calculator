import { AppProviders } from './context/AppProviders';
import { Header } from './components/shell/Header';
import { Sidebar } from './components/shell/Sidebar';
import { SettingsPanel } from './components/shell/SettingsPanel';
import { Dashboard } from './components/shell/Dashboard';
import { CalculatorHost } from './components/CalculatorHost';
import { MathPage } from './features/math/MathPage';

/**
 * Phase 2 shell + Phase 3 Math:
 * Shell and Math are pure React. Other sections still use the engine.
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
          <CalculatorHost />
        </div>
      </div>
    </AppProviders>
  );
}

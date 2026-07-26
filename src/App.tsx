import { AppProviders } from './context/AppProviders';
import { Header } from './components/shell/Header';
import { Sidebar } from './components/shell/Sidebar';
import { SettingsPanel } from './components/shell/SettingsPanel';
import { Dashboard } from './components/shell/Dashboard';
import { CalculatorHost } from './components/CalculatorHost';

/**
 * Phase 2 — React shell:
 * Header, sidebar, settings, dashboard/favorites are pure React.
 * Calculator tools still boot from the proven engine module.
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
          <CalculatorHost />
        </div>
      </div>
    </AppProviders>
  );
}

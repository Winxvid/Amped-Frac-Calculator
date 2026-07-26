import { useTheme } from '../../context/ThemeContext';
import { useNavigation } from '../../context/NavigationContext';

export function Header() {
  const { logoSrc, resolvedMode, toggleLightDark } = useTheme();
  const { openMenu, openSettings } = useNavigation();

  return (
    <div className="nav-wrap">
      <div className="nav-header">
        <button
          type="button"
          className="menu-btn"
          onClick={openMenu}
          aria-label="Open menu"
        >
          ☰
        </button>
        <div className="nav-logo-center">
          {logoSrc ? (
            <img className="app-logo" src={logoSrc} alt="Company logo" />
          ) : (
            <img className="app-logo" alt="" data-empty="1" />
          )}
        </div>
        <div className="nav-header-actions">
          <button
            type="button"
            className="menu-btn theme-toggle-btn"
            onClick={toggleLightDark}
            aria-label={
              resolvedMode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'
            }
            title={resolvedMode === 'dark' ? 'Light mode' : 'Dark mode'}
          >
            {resolvedMode === 'dark' ? '☀' : '☾'}
          </button>
          <button
            type="button"
            className="menu-btn settings-btn"
            onClick={openSettings}
            aria-label="Open settings"
            title="Settings"
          >
            ⚙
          </button>
        </div>
      </div>
    </div>
  );
}

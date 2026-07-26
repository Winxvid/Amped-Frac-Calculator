import { useTheme } from '../../context/ThemeContext';
import { useNavigation } from '../../context/NavigationContext';

export function Header() {
  const { logoSrc } = useTheme();
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
  );
}

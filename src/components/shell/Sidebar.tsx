import { NAV_ICON_SRC, TABS } from '../../lib/constants';
import { useTheme } from '../../context/ThemeContext';
import { useNavigation } from '../../context/NavigationContext';

export function Sidebar() {
  const { logoSrc } = useTheme();
  const { tab, menuOpen, closeMenu, navigate } = useNavigation();

  return (
    <>
      <div
        id="sidebar-overlay"
        className={menuOpen ? 'open' : ''}
        onClick={closeMenu}
        aria-hidden={!menuOpen}
      />
      <div id="sidebar" className={menuOpen ? 'open' : ''} aria-hidden={!menuOpen}>
        <div className="sidebar-hdr">
          {logoSrc ? (
            <img className="app-logo" src={logoSrc} alt="Company logo" />
          ) : (
            <img className="app-logo" alt="" data-empty="1" />
          )}
          <button
            type="button"
            className="sidebar-close"
            onClick={closeMenu}
            aria-label="Close menu"
          >
            ✕
          </button>
        </div>
        <div className="sidebar-section-lbl">Navigation</div>
        <nav id="sidebar-nav">
          {TABS.map((t) => {
            const iconSrc = NAV_ICON_SRC[t.id];
            return (
              <button
                key={t.id}
                type="button"
                className={`tab-btn${tab === t.id ? ' active' : ''}`}
                data-tab={t.id}
                onClick={() => navigate(t.id)}
              >
                <span className="snav-icon">
                  {t.id === 'dashboard' ? (
                    '🏠'
                  ) : iconSrc ? (
                    <img src={iconSrc} alt="" />
                  ) : null}
                </span>
                <span className="snav-label">{t.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </>
  );
}

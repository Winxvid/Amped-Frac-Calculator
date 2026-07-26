import { DASH_CARDS, TAB_LABELS } from '../../lib/constants';
import { NAV_ICON_SRC } from '../../lib/icons';
import { useFavorites } from '../../context/FavoritesContext';
import { useNavigation } from '../../context/NavigationContext';
import { useTheme } from '../../context/ThemeContext';
import { HeartIcon } from '../ui/HeartIcon';
import { SmokyText } from '../ui/SmokyText';

export function Dashboard() {
  const { tab, navigate, openFavoriteTool } = useNavigation();
  const { favorites, toggleFavorite } = useFavorites();
  const { theme, resolvedMode } = useTheme();
  const active = tab === 'dashboard';

  // Replay smoke when entering Home or when profile / appearance changes
  const smokeKey = `${active}-${theme.profileId}-${theme.green}-${theme.blue}-${resolvedMode}`;

  return (
    <div className={`section${active ? ' active' : ''}`} id="s-dashboard">
      <div className="mb-4 dashboard-header">
        <div>
          <SmokyText
            text="Hydraulic Fracturing"
            color="var(--title-color)"
            className="sec-title smoky-dash-title"
            intensity={12}
            duration={2}
            delay={0.08}
            position="bottomLeft"
            animationMode="singleLine"
            motionScale={0.28}
            replayKey={smokeKey}
            style={{
              fontFamily: "'Space Grotesk', 'Inter', system-ui, sans-serif",
              fontWeight: 900,
              fontSize: 'clamp(26px, 7vw, 34px)',
              letterSpacing: '0.04em',
              lineHeight: 1.15,
              display: 'block',
              width: '100%',
              textAlign: 'center',
            }}
          />
          <SmokyText
            text="Field Calculator"
            color="var(--brand)"
            className="sec-sub smoky-dash-sub"
            intensity={10}
            duration={1.7}
            delay={0.35}
            position="bottomLeft"
            animationMode="singleLine"
            motionScale={0.24}
            replayKey={smokeKey}
            style={{
              fontFamily: "'Space Grotesk', 'Inter', system-ui, sans-serif",
              fontWeight: 800,
              fontSize: 'clamp(14px, 3.8vw, 17px)',
              letterSpacing: '0.06em',
              lineHeight: 1.25,
              display: 'block',
              width: '100%',
              textAlign: 'center',
              marginTop: 10,
            }}
          />
        </div>
      </div>

      <div className="card mb-4" id="favorites-card">
        <div className="lbl mb-3 tool-title" style={{ pointerEvents: 'none' }}>
          Favorites
        </div>
        {favorites.length === 0 ? (
          <div id="favorites-empty">
            Tap the ♡ on any calculator tool to pin it here for quick access.
          </div>
        ) : (
          <div id="favorites-list">
            {favorites.map((f) => (
              <div key={f.id} className="fav-item" style={{ cursor: 'default' }}>
                <button
                  type="button"
                  className="fav-item-body"
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    textAlign: 'left',
                    cursor: 'pointer',
                    flex: 1,
                    minWidth: 0,
                    fontFamily: 'inherit',
                  }}
                  onClick={() => openFavoriteTool(f.id, f.tab)}
                >
                  <div className="fav-item-label">{f.label}</div>
                  <div className="fav-item-tab">
                    {TAB_LABELS[f.tab] || f.tab}
                  </div>
                </button>
                <HeartIcon
                  size={20}
                  filled
                  color="#e11d48"
                  title="Remove from favorites"
                  onClick={() => toggleFavorite(f.id, f.label, f.tab)}
                  className="fav-heart is-fav"
                />
                <button
                  type="button"
                  className="fav-item-go"
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                  }}
                  onClick={() => openFavoriteTool(f.id, f.tab)}
                >
                  Open →
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mb-4" id="dash-grid" data-react-owned="1">
        {DASH_CARDS.map((c, i) => {
          const src = NAV_ICON_SRC[c.id];
          return (
            <div
              key={c.id}
              className="nav-card"
              onClick={() => navigate(c.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') navigate(c.id);
              }}
              role="button"
              tabIndex={0}
              style={{ background: c.bg }}
            >
              <div className="nav-card-icon">
                {src ? (
                  <img
                    src={src}
                    alt={c.label}
                    className="nav-card-icon-img"
                    loading="eager"
                    decoding="async"
                    draggable={false}
                  />
                ) : null}
              </div>
              {/* inPlace = smoke puff without flying off the card */}
              <SmokyText
                text={c.label}
                color="var(--title-color)"
                className="nav-card-label smoky-card-label"
                intensity={9}
                duration={1.4}
                delay={0.15 + i * 0.07}
                position="bottomLeft"
                animationMode="inPlace"
                motionScale={0.18}
                replayKey={smokeKey}
                as="span"
                style={{
                  fontFamily: "'Space Grotesk', 'Inter', system-ui, sans-serif",
                  fontWeight: 900,
                  fontSize: 15,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  lineHeight: 1.2,
                  textAlign: 'center',
                }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

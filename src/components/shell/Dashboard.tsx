import { DASH_CARDS, NAV_ICON_SRC, TAB_LABELS } from '../../lib/constants';
import { useFavorites } from '../../context/FavoritesContext';
import { useNavigation } from '../../context/NavigationContext';
import { HeartIcon } from '../ui/HeartIcon';

export function Dashboard() {
  const { tab, navigate, openFavoriteTool } = useNavigation();
  const { favorites, toggleFavorite } = useFavorites();
  const active = tab === 'dashboard';

  return (
    <div className={`section${active ? ' active' : ''}`} id="s-dashboard">
      <div className="mb-4 dashboard-header">
        <div>
          <div className="sec-title fx-foil">Hydraulic Fracturing</div>
          <div className="sec-sub fx-foil">Field Calculator</div>
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
        {DASH_CARDS.map((c) => {
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
                    alt=""
                    style={{
                      height: 32,
                      width: 'auto',
                      maxWidth: 96,
                      objectFit: 'contain',
                      borderRadius: 5,
                    }}
                  />
                ) : null}
              </div>
              <div className="nav-card-label fx-foil">{c.label}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

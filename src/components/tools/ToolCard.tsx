import type { ReactNode } from 'react';
import { useFavorites } from '../../context/FavoritesContext';
import { HeartIcon } from '../ui/HeartIcon';

function slugToolId(tab: string, label: string) {
  const s = String(label || '')
    .toLowerCase()
    .replace(/&amp;/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  return `${tab}__${s || 'tool'}`;
}

type ToolCardProps = {
  title: string;
  tab: string;
  children: ReactNode;
  badge?: ReactNode;
  formula?: string;
  className?: string;
};

/**
 * Shared calculator card with favorite heart on every tool.
 */
export function ToolCard({
  title,
  tab,
  children,
  badge,
  formula,
  className = '',
}: ToolCardProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const toolId = slugToolId(tab, title);
  const fav = isFavorite(toolId);

  return (
    <div
      className={`card mb-4 ${className}`.trim()}
      data-tool-id={toolId}
      data-tool-label={title}
      data-tool-tab={tab}
    >
      <div className="tool-title-with-heart">
        <span className="tool-title-text tool-title lbl" style={{ margin: 0 }}>
          {title}
        </span>
        <div className="tool-title-actions">
          {badge}
          <HeartIcon
            size={22}
            filled={fav}
            title={fav ? 'Remove from favorites' : 'Add to favorites'}
            onClick={() => toggleFavorite(toolId, title, tab)}
            className={`fav-heart${fav ? ' is-fav' : ''}`}
          />
        </div>
      </div>
      {formula ? (
        <div style={{ fontSize: 11, color: 'var(--text2)', marginBottom: 12 }}>
          {formula}
        </div>
      ) : null}
      {children}
    </div>
  );
}

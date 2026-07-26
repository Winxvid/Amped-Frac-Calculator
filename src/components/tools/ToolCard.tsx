import { useEffect, useRef, useState, type ReactNode } from 'react';
import { useFavorites } from '../../context/FavoritesContext';
import { useNavigation } from '../../context/NavigationContext';
import { useTheme } from '../../context/ThemeContext';
import { HeartIcon } from '../ui/HeartIcon';
import { SmokyText } from '../ui/SmokyText';

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
 * Calculator tool card with favorite heart + smoky title when in view.
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
  const { tab: activeTab } = useNavigation();
  const { theme, resolvedMode } = useTheme();
  const toolId = slugToolId(tab, title);
  const fav = isFavorite(toolId);
  const sectionActive = activeTab === tab;

  const cardRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  // Only run smoke when card is on-screen (keeps 90+ cards performant)
  useEffect(() => {
    if (!sectionActive) {
      setInView(false);
      return;
    }
    const el = cardRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) setInView(true);
      },
      { root: null, rootMargin: '40px 0px', threshold: 0.12 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [sectionActive, title]);

  const smokeKey = inView
    ? `${sectionActive}-${tab}-${title}-${theme.profileId}-${theme.green}-${resolvedMode}`
    : 'idle';

  return (
    <div
      ref={cardRef}
      className={`card mb-4 ${className}`.trim()}
      data-tool-id={toolId}
      data-tool-label={title}
      data-tool-tab={tab}
    >
      <div className="tool-title-with-heart">
        {inView && sectionActive ? (
          <SmokyText
            text={title}
            color="var(--title-color)"
            className="tool-title-text tool-title lbl smoky-tool-title"
            intensity={8}
            duration={1.25}
            delay={0.04}
            animationMode="inPlace"
            motionScale={0.14}
            replayKey={smokeKey}
            as="span"
            style={{
              margin: 0,
              fontFamily: "'Space Grotesk', 'Inter', system-ui, sans-serif",
              fontWeight: 900,
              fontSize: 14,
              letterSpacing: '0.4px',
              lineHeight: 1.3,
              textTransform: 'none',
              flex: '1 1 auto',
              minWidth: 0,
            }}
          />
        ) : (
          <span className="tool-title-text tool-title lbl" style={{ margin: 0 }}>
            {title}
          </span>
        )}
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

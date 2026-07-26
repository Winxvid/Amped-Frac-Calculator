import { useRef } from 'react';
import { motion, useAnimate } from 'framer-motion';

export type HeartIconProps = {
  size?: number | string;
  color?: string;
  strokeWidth?: number;
  className?: string;
  filled?: boolean;
  onClick?: () => void;
  title?: string;
};

/**
 * Pure React heart icon with beat animation (framer-motion).
 * Ready for shell rewrite of favorites; legacy engine still uses SVG hearts.
 */
export function HeartIcon({
  size = 24,
  color = 'currentColor',
  strokeWidth = 2,
  className = '',
  filled = false,
  onClick,
  title,
}: HeartIconProps) {
  const [scope, animate] = useAnimate();
  const busy = useRef(false);

  const start = async () => {
    if (busy.current) return;
    busy.current = true;
    try {
      await animate(
        '.heart',
        { scale: [1, 1.15, 1, 1.25, 1] },
        { duration: 0.6, ease: 'easeOut' },
      );
    } finally {
      busy.current = false;
    }
  };

  return (
    <motion.button
      type="button"
      className={className}
      title={title}
      aria-label={title}
      onClick={() => {
        void start();
        onClick?.();
      }}
      onHoverStart={() => void start()}
      style={{
        background: 'none',
        border: 'none',
        padding: 4,
        cursor: 'pointer',
        color,
        display: 'inline-flex',
        lineHeight: 0,
      }}
    >
      <motion.svg
        ref={scope}
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ overflow: 'visible' }}
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <motion.path
          className="heart"
          style={{ transformOrigin: '50% 50%' }}
          fill={filled ? 'currentColor' : 'none'}
          d="M19.5 12.572l-7.5 7.428l-7.5 -7.428a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572"
        />
      </motion.svg>
    </motion.button>
  );
}

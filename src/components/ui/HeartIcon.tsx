import {
  forwardRef,
  useImperativeHandle,
  useRef,
  type MouseEvent,
} from 'react';
import { motion, useAnimate } from 'motion/react';
import type { AnimatedIconHandle, AnimatedIconProps } from './animatedIconTypes';

export type HeartIconProps = AnimatedIconProps & {
  /** Solid fill when favorited */
  filled?: boolean;
  onClick?: () => void;
  title?: string;
};

/**
 * Animated heart (Motion) — beat on hover/tap.
 * Used for favorites on every tool card and the dashboard list.
 */
const HeartIcon = forwardRef<AnimatedIconHandle, HeartIconProps>(
  (
    {
      size = 24,
      color = 'currentColor',
      strokeWidth = 2,
      className = '',
      filled = false,
      onClick,
      title,
    },
    ref,
  ) => {
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

    const stop = () => {
      animate('.heart', { scale: 1 }, { duration: 0.2, ease: 'easeOut' });
    };

    useImperativeHandle(ref, () => ({
      startAnimation: () => {
        void start();
      },
      stopAnimation: stop,
    }));

    const handleClick = (e: MouseEvent) => {
      e.stopPropagation();
      void start();
      onClick?.();
    };

    return (
      <motion.button
        type="button"
        className={`${className} cursor-pointer`.trim()}
        title={title}
        aria-label={title || (filled ? 'Remove from favorites' : 'Add to favorites')}
        aria-pressed={filled}
        onClick={handleClick}
        onHoverStart={() => {
          void start();
        }}
        onHoverEnd={() => {
          stop();
        }}
        style={{
          background: 'none',
          border: 'none',
          padding: 4,
          cursor: 'pointer',
          color,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          lineHeight: 0,
          WebkitTapHighlightColor: 'transparent',
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
          style={{ overflow: 'visible', display: 'block' }}
        >
          <motion.path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <motion.path
            className="heart"
            style={{ transformOrigin: '50% 50%' }}
            fill={filled ? 'currentColor' : 'none'}
            d="M19.5 12.572l-7.5 7.428l-7.5 -7.428a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572"
          />
        </motion.svg>
      </motion.button>
    );
  },
);

HeartIcon.displayName = 'HeartIcon';

export default HeartIcon;
export { HeartIcon };

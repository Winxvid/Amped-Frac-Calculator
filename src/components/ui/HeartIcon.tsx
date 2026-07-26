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
 * Animated Motion heart — beat on hover/tap.
 * Stroke uses currentColor so CSS vars on the button always resolve.
 */
const HeartIcon = forwardRef<AnimatedIconHandle, HeartIconProps>(
  (
    {
      size = 24,
      color,
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
      e.preventDefault();
      e.stopPropagation();
      void start();
      onClick?.();
    };

    return (
      <motion.button
        type="button"
        className={className}
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
          // Prefer explicit color when passed; otherwise CSS (.fav-heart) owns it
          ...(color ? { color } : null),
          background: 'none',
          border: 'none',
          padding: 0,
          margin: 0,
          cursor: 'pointer',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          lineHeight: 0,
          flexShrink: 0,
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
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          style={{ overflow: 'visible', display: 'block', flexShrink: 0 }}
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
  },
);

HeartIcon.displayName = 'HeartIcon';

export default HeartIcon;
export { HeartIcon };

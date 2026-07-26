import {
  useMemo,
  useEffect,
  useRef,
  useState,
  useCallback,
  type CSSProperties,
} from 'react';

type Position = 'bottomLeft' | 'topLeft';
type AnimationMode = 'singleLine' | 'multiLine' | 'inPlace';
type Phase = 'hidden' | 'appearing' | 'visible';

interface CharEntry {
  char: string;
  globalIdx: number;
  posInLine: number;
  lineIdx: number;
}

interface Group {
  type: 'word' | 'space' | 'newline';
  chars: CharEntry[];
  lineIdx: number;
  gi: number;
}

interface VLI {
  charVL: Map<number, number>;
  charVLPos: Map<number, number>;
  vlLen: Map<number, number>;
}

export type SmokyTextProps = {
  text: string;
  /** Solid fill + smoke color — use profile CSS vars e.g. var(--title-color) */
  color?: string;
  className?: string;
  style?: CSSProperties;
  intensity?: number;
  position?: Position;
  animationMode?: AnimationMode;
  /** Total appear duration in seconds */
  duration?: number;
  delay?: number;
  /** Re-fire animation when this changes (e.g. tab active, profile) */
  replayKey?: string | number | boolean;
  as?: 'div' | 'span';
};

function buildGroups(text: string) {
  const lines = text.split('\n');
  const groups: Group[] = [];
  let globalIdx = 0;
  let gi = 0;
  lines.forEach((line, lineIdx) => {
    let posInLine = 0;
    (line.match(/\S+|\s+/g) ?? []).forEach((seg) => {
      groups.push({
        type: /^\s/.test(seg) ? 'space' : 'word',
        chars: seg.split('').map((c) => ({
          char: c,
          globalIdx: globalIdx++,
          posInLine: posInLine++,
          lineIdx,
        })),
        lineIdx,
        gi: gi++,
      });
    });
    if (lineIdx < lines.length - 1) {
      groups.push({ type: 'newline', chars: [], lineIdx, gi: gi++ });
    }
  });
  return { groups, totalVisible: globalIdx };
}

function rawDelay(
  c: CharEntry,
  mode: AnimationMode,
  vli: VLI | null,
): number {
  const S = 0.1;
  if (mode === 'inPlace') return 0;
  if (mode === 'multiLine' && vli) {
    const p = vli.charVLPos.get(c.globalIdx) ?? 0;
    return p * S;
  }
  return c.globalIdx * S;
}

function scaledTiming(
  rawD: number,
  maxRaw: number,
  duration: number,
): { delay: number; charDur: number } {
  if (maxRaw <= 0) return { delay: 0, charDur: duration };
  return {
    charDur: duration * 0.5,
    delay: (rawD * (duration * 0.5)) / maxRaw,
  };
}

function getAppear(
  c: CharEntry,
  pos: Position,
  mode: AnimationMode,
): string {
  const e = c.globalIdx % 2 === 0;
  if (mode === 'inPlace') return e ? 'smt-ap-c-a' : 'smt-ap-c-b';
  if (pos === 'topLeft') return e ? 'smt-ap-tl-a' : 'smt-ap-tl-b';
  return e ? 'smt-ap-bl-a' : 'smt-ap-bl-b';
}

function buildKF(color: string, intensity: number, uid: string) {
  const n = (Math.max(1, Math.min(20, intensity)) - 1) / 19;
  const r = (v: number) => +v.toFixed(2);

  const peakB = Math.round(6 + n * 200);
  const initB = Math.round(2 + n * 70);
  const layers = 1 + Math.round(n * 3);
  const stack = (blur: number) =>
    Array.from(
      { length: layers },
      (_, i) => `0 0 ${Math.round((blur * (i + 1)) / layers)}px ${color}`,
    ).join(',');
  const peak = stack(peakB);
  const init = stack(initB);

  const d = 0.7 + n * 0.8;
  const ic = r(1.3 + n * 0.5);
  const ic2 = r(1.15 + n * 0.35);

  // Per-instance keyframe names so multiple colors/intensities coexist
  const p = (name: string) => `${name}-${uid}`;

  return `
@keyframes ${p('smt-ap-c-a')}{from{opacity:0;text-shadow:${init};transform:scale(${ic})}40%{text-shadow:${peak}}to{opacity:1;text-shadow:0 0 0 ${color};transform:none}}
@keyframes ${p('smt-ap-c-b')}{from{opacity:0;text-shadow:${init};transform:scale(${ic2})}40%{text-shadow:${peak}}to{opacity:1;text-shadow:0 0 0 ${color};transform:none}}
@keyframes ${p('smt-ap-bl-a')}{from{opacity:0;text-shadow:${init};transform:translate3d(${r(-15 * d)}rem,${r(8 * d)}rem,0) rotate(40deg) skewX(-70deg) scale(0.7)}40%{text-shadow:${peak}}to{opacity:1;text-shadow:0 0 0 ${color};transform:none}}
@keyframes ${p('smt-ap-bl-b')}{from{opacity:0;text-shadow:${init};transform:translate3d(${r(-18 * d)}rem,${r(8 * d)}rem,0) rotate(40deg) skewX(70deg) scale(0.5)}40%{text-shadow:${peak}}to{opacity:1;text-shadow:0 0 0 ${color};transform:none}}
@keyframes ${p('smt-ap-tl-a')}{from{opacity:0;text-shadow:${init};transform:translate3d(${r(-15 * d)}rem,${r(-8 * d)}rem,0) rotate(-40deg) skewX(70deg) scale(0.7)}40%{text-shadow:${peak}}to{opacity:1;text-shadow:0 0 0 ${color};transform:none}}
@keyframes ${p('smt-ap-tl-b')}{from{opacity:0;text-shadow:${init};transform:translate3d(${r(-18 * d)}rem,${r(-8 * d)}rem,0) rotate(-40deg) skewX(-70deg) scale(0.5)}40%{text-shadow:${peak}}to{opacity:1;text-shadow:0 0 0 ${color};transform:none}}
`;
}

let smokyUid = 0;

/**
 * Smoky Text appear animation (Originkit-style).
 * Color follows the active company profile via CSS vars or hex.
 */
export function SmokyText({
  text,
  color = 'var(--title-color)',
  className = '',
  style,
  intensity = 8,
  position = 'bottomLeft',
  animationMode = 'singleLine',
  duration = 1.6,
  delay = 0,
  replayKey,
  as = 'div',
}: SmokyTextProps) {
  const uid = useMemo(() => `s${++smokyUid}`, []);
  const kfEl = useRef<HTMLStyleElement | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const wordRefs = useRef(new Map<number, HTMLElement>());
  const [vli, setVli] = useState<VLI | null>(null);
  const [phase, setPhase] = useState<Phase>('hidden');
  const tRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const { groups, totalVisible } = useMemo(() => buildGroups(text), [text]);

  useEffect(() => {
    const el = document.createElement('style');
    kfEl.current = el;
    document.head.appendChild(el);
    return () => {
      el.remove();
      kfEl.current = null;
    };
  }, []);

  useEffect(() => {
    if (kfEl.current) {
      kfEl.current.textContent = buildKF(color, intensity, uid);
    }
  }, [color, intensity, uid]);

  const measureVL = useCallback(() => {
    if (animationMode !== 'multiLine') {
      setVli(null);
      return;
    }
    const items: { top: number; gi: number; chars: CharEntry[] }[] = [];
    groups.forEach((g) => {
      if (g.type === 'newline' || !g.chars.length) return;
      const el = wordRefs.current.get(g.gi);
      if (el) items.push({ top: el.offsetTop, gi: g.gi, chars: g.chars });
    });
    items.sort((a, b) => a.gi - b.gi);
    const tops = [...new Set(items.map((i) => i.top))].sort((a, b) => a - b);
    const topToVL = new Map(tops.map((t, i) => [t, i]));
    const charVL = new Map<number, number>();
    const charVLPos = new Map<number, number>();
    const vlLen = new Map<number, number>();
    const vlPos = new Map<number, number>();
    items.forEach(({ top, chars }) => {
      const vl = topToVL.get(top) ?? 0;
      chars.forEach((c) => {
        const p = vlPos.get(vl) ?? 0;
        charVL.set(c.globalIdx, vl);
        charVLPos.set(c.globalIdx, p);
        vlPos.set(vl, p + 1);
        vlLen.set(vl, p + 1);
      });
    });
    setVli({ charVL, charVLPos, vlLen });
  }, [groups, animationMode]);

  useEffect(() => {
    measureVL();
    if (!containerRef.current) return;
    const ro = new ResizeObserver(measureVL);
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, [measureVL]);

  const maxRaw = useMemo(() => {
    let m = 0;
    groups.forEach((g) =>
      g.chars.forEach((c) => {
        const d = rawDelay(c, animationMode, vli);
        if (d > m) m = d;
      }),
    );
    return m;
  }, [groups, animationMode, vli]);

  const clear = useCallback(() => {
    tRef.current.forEach(clearTimeout);
    tRef.current = [];
  }, []);

  const later = useCallback(
    (fn: () => void, ms: number) => {
      tRef.current.push(setTimeout(fn, ms));
    },
    [],
  );

  const runAppear = useCallback(() => {
    clear();
    setPhase('hidden');
    later(() => {
      setPhase('appearing');
      later(() => setPhase('visible'), duration * 1000 + 200);
    }, Math.max(delay * 1000, 60));
  }, [clear, later, duration, delay]);

  useEffect(() => {
    runAppear();
    return clear;
  }, [text, color, intensity, position, animationMode, duration, delay, replayKey, runAppear, clear]);

  const animName = (base: string) => `${base}-${uid}`;

  const Tag = as;

  return (
    <Tag
      ref={containerRef as never}
      className={`smoky-text ${className}`.trim()}
      style={{
        display: 'inline-block',
        maxWidth: '100%',
        ...style,
      }}
      aria-label={text.replace(/\n/g, ' ')}
    >
      <span
        style={{
          color: 'transparent',
          backfaceVisibility: 'hidden',
          userSelect: 'none',
          wordBreak: 'keep-all',
          overflowWrap: 'normal',
        }}
      >
        {groups.map((group) => {
          if (group.type === 'newline') return <br key={group.gi} />;
          if (group.type === 'space') {
            return (
              <span
                key={group.gi}
                ref={(el) => {
                  if (el) wordRefs.current.set(group.gi, el);
                }}
                style={{ display: 'inline', whiteSpace: 'pre' }}
              >
                {' '}
              </span>
            );
          }

          return (
            <span
              key={group.gi}
              ref={(el) => {
                if (el) wordRefs.current.set(group.gi, el);
              }}
              style={{ display: 'inline-block', whiteSpace: 'nowrap' }}
            >
              {group.chars.map((c) => {
                const base: CSSProperties = {
                  display: 'inline-block',
                  textShadow: `0 0 0 ${color}`,
                  color,
                };

                if (phase === 'hidden') {
                  return (
                    <span key={c.globalIdx} style={{ ...base, opacity: 0 }}>
                      {c.char}
                    </span>
                  );
                }

                if (phase === 'visible') {
                  return (
                    <span key={c.globalIdx} style={{ ...base, opacity: 1 }}>
                      {c.char}
                    </span>
                  );
                }

                // appearing
                const rd = rawDelay(c, animationMode, vli);
                const { delay: dly, charDur } = scaledTiming(
                  rd,
                  maxRaw,
                  duration,
                );
                const anim = animName(getAppear(c, position, animationMode));
                return (
                  <span
                    key={c.globalIdx}
                    style={{
                      ...base,
                      animation: `${anim} ${charDur}s ${dly}s cubic-bezier(0,0,0.58,1) both`,
                    }}
                  >
                    {c.char}
                  </span>
                );
              })}
            </span>
          );
        })}
      </span>
    </Tag>
  );
}

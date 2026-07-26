import {
  useMemo,
  useEffect,
  useRef,
  useState,
  useCallback,
  type CSSProperties,
  type ElementType,
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
  charVLPos: Map<number, number>;
}

export type SmokyTextProps = {
  text: string;
  /** Smoke + fill color — hex or CSS var (resolved to rgb for keyframes) */
  color?: string;
  className?: string;
  style?: CSSProperties;
  /** 1–20; higher = heavier smoke */
  intensity?: number;
  position?: Position;
  animationMode?: AnimationMode;
  duration?: number;
  delay?: number;
  /** Scale fly-in distance (0.12–1). UI labels need ~0.15 so smoke isn’t clipped. */
  motionScale?: number;
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

function rawDelay(c: CharEntry, mode: AnimationMode, vli: VLI | null): number {
  const S = 0.1;
  if (mode === 'inPlace') return 0;
  if (mode === 'multiLine' && vli) {
    return (vli.charVLPos.get(c.globalIdx) ?? 0) * S;
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
    charDur: duration * 0.55,
    delay: (rawD * (duration * 0.45)) / maxRaw,
  };
}

function getAppear(c: CharEntry, pos: Position, mode: AnimationMode): string {
  const e = c.globalIdx % 2 === 0;
  if (mode === 'inPlace') return e ? 'smt-ap-c-a' : 'smt-ap-c-b';
  if (pos === 'topLeft') return e ? 'smt-ap-tl-a' : 'smt-ap-tl-b';
  return e ? 'smt-ap-bl-a' : 'smt-ap-bl-b';
}

/** Resolve CSS color (incl. var(--x)) to rgb() for reliable keyframes. */
function resolveCssColor(color: string, host: Element | null): string {
  if (typeof document === 'undefined') return color;
  try {
    const probe = document.createElement('span');
    probe.style.color = color;
    probe.style.position = 'absolute';
    probe.style.visibility = 'hidden';
    probe.style.pointerEvents = 'none';
    (host || document.body).appendChild(probe);
    const resolved = getComputedStyle(probe).color;
    probe.remove();
    if (resolved && resolved !== 'rgba(0, 0, 0, 0)' && resolved !== 'transparent') {
      return resolved;
    }
  } catch {
    /* ignore */
  }
  return color.startsWith('#') || color.startsWith('rgb') ? color : '#2DC76D';
}

/**
 * Build smoke keyframes.
 * intensity 1 = crisp puff · 20 = heavy cloud
 * motionScale shrinks fly-in so small UI text isn’t clipped off-screen
 */
function buildKF(
  color: string,
  intensity: number,
  uid: string,
  motionScale: number,
) {
  const n = (Math.max(1, Math.min(20, intensity)) - 1) / 19;
  const r = (v: number) => +v.toFixed(2);
  const ms = Math.max(0.08, Math.min(1.2, motionScale));

  // Visible smoke at UI sizes: keep blur in a useful range (not 200px wash)
  const peakB = Math.round(8 + n * 36); // 8 → 44px
  const initB = Math.round(4 + n * 18); // 4 → 22px
  const layers = 2 + Math.round(n * 2); // 2 → 4

  const stack = (blur: number) =>
    Array.from({ length: layers }, (_, i) => {
      const b = Math.round((blur * (i + 1)) / layers);
      // slight spread so smoke has mass, not a single halo
      const o = i * 0.4;
      return `${o}px ${o}px ${b}px ${color}`;
    }).join(',');

  const peak = stack(peakB);
  const init = stack(initB);
  const d = (0.55 + n * 0.55) * ms; // fly distance scaled for UI
  const ic = r(1.15 + n * 0.35);
  const ic2 = r(1.08 + n * 0.25);
  const p = (name: string) => `${name}-${uid}`;

  return `
@keyframes ${p('smt-ap-c-a')}{
  from{opacity:0;color:${color};text-shadow:${init};transform:scale(${ic})}
  35%{opacity:0.85;text-shadow:${peak}}
  to{opacity:1;color:${color};text-shadow:0 0 0 ${color};transform:none}
}
@keyframes ${p('smt-ap-c-b')}{
  from{opacity:0;color:${color};text-shadow:${init};transform:scale(${ic2})}
  35%{opacity:0.85;text-shadow:${peak}}
  to{opacity:1;color:${color};text-shadow:0 0 0 ${color};transform:none}
}
@keyframes ${p('smt-ap-bl-a')}{
  from{opacity:0;color:${color};text-shadow:${init};transform:translate3d(${r(-4 * d)}rem,${r(2.2 * d)}rem,0) rotate(18deg) skewX(-28deg) scale(0.75)}
  40%{opacity:0.9;text-shadow:${peak}}
  to{opacity:1;color:${color};text-shadow:0 0 0 ${color};transform:none}
}
@keyframes ${p('smt-ap-bl-b')}{
  from{opacity:0;color:${color};text-shadow:${init};transform:translate3d(${r(-5 * d)}rem,${r(2.4 * d)}rem,0) rotate(18deg) skewX(28deg) scale(0.65)}
  40%{opacity:0.9;text-shadow:${peak}}
  to{opacity:1;color:${color};text-shadow:0 0 0 ${color};transform:none}
}
@keyframes ${p('smt-ap-tl-a')}{
  from{opacity:0;color:${color};text-shadow:${init};transform:translate3d(${r(-4 * d)}rem,${r(-2.2 * d)}rem,0) rotate(-18deg) skewX(28deg) scale(0.75)}
  40%{opacity:0.9;text-shadow:${peak}}
  to{opacity:1;color:${color};text-shadow:0 0 0 ${color};transform:none}
}
@keyframes ${p('smt-ap-tl-b')}{
  from{opacity:0;color:${color};text-shadow:${init};transform:translate3d(${r(-5 * d)}rem,${r(-2.4 * d)}rem,0) rotate(-18deg) skewX(-28deg) scale(0.65)}
  40%{opacity:0.9;text-shadow:${peak}}
  to{opacity:1;color:${color};text-shadow:0 0 0 ${color};transform:none}
}
`;
}

let smokyUid = 0;

/**
 * Smoky Text appear animation — profile-colored smoke puff into solid type.
 */
export function SmokyText({
  text,
  color = 'var(--title-color)',
  className = '',
  style,
  intensity = 10,
  position = 'bottomLeft',
  animationMode = 'singleLine',
  duration = 1.7,
  delay = 0,
  motionScale = 0.22,
  replayKey,
  as = 'div',
}: SmokyTextProps) {
  const uid = useMemo(() => `s${++smokyUid}`, []);
  const kfEl = useRef<HTMLStyleElement | null>(null);
  const containerRef = useRef<HTMLElement | null>(null);
  const wordRefs = useRef(new Map<number, HTMLElement>());
  const [vli, setVli] = useState<VLI | null>(null);
  const [phase, setPhase] = useState<Phase>('hidden');
  const [resolvedColor, setResolvedColor] = useState(color);
  const tRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const { groups } = useMemo(() => buildGroups(text), [text]);

  // Mount stylesheet
  useEffect(() => {
    const el = document.createElement('style');
    el.setAttribute('data-smoky', uid);
    kfEl.current = el;
    document.head.appendChild(el);
    return () => {
      el.remove();
      kfEl.current = null;
    };
  }, [uid]);

  // Resolve CSS vars → rgb and inject keyframes
  useEffect(() => {
    const host = containerRef.current;
    const rgb = resolveCssColor(color, host);
    setResolvedColor(rgb);
    if (kfEl.current) {
      kfEl.current.textContent = buildKF(rgb, intensity, uid, motionScale);
    }
  }, [color, intensity, uid, motionScale, replayKey]);

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
    const charVLPos = new Map<number, number>();
    const vlPos = new Map<number, number>();
    items.forEach(({ top, chars }) => {
      const vl = topToVL.get(top) ?? 0;
      chars.forEach((c) => {
        const p = vlPos.get(vl) ?? 0;
        charVLPos.set(c.globalIdx, p);
        vlPos.set(vl, p + 1);
      });
    });
    setVli({ charVLPos });
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

  const later = useCallback((fn: () => void, ms: number) => {
    tRef.current.push(setTimeout(fn, ms));
  }, []);

  const runAppear = useCallback(() => {
    clear();
    setPhase('hidden');
    later(() => {
      // Re-resolve color right before paint (theme may have just applied)
      if (containerRef.current && kfEl.current) {
        const rgb = resolveCssColor(color, containerRef.current);
        setResolvedColor(rgb);
        kfEl.current.textContent = buildKF(rgb, intensity, uid, motionScale);
      }
      setPhase('appearing');
      later(() => setPhase('visible'), duration * 1000 + 250);
    }, Math.max(delay * 1000, 40));
  }, [clear, later, duration, delay, color, intensity, uid, motionScale]);

  useEffect(() => {
    runAppear();
    return clear;
  }, [
    text,
    color,
    intensity,
    position,
    animationMode,
    duration,
    delay,
    motionScale,
    replayKey,
    runAppear,
    clear,
  ]);

  const animName = (base: string) => `${base}-${uid}`;
  const Tag = as as ElementType;

  return (
    <Tag
      ref={(node: HTMLElement | null) => {
        containerRef.current = node;
      }}
      className={`smoky-text ${className}`.trim()}
      style={{
        display: 'inline-block',
        maxWidth: '100%',
        overflow: 'visible',
        ...style,
      }}
      aria-label={text.replace(/\n/g, ' ')}
    >
      <span
        className="smoky-text-inner"
        style={{
          display: 'inline',
          backfaceVisibility: 'hidden',
          userSelect: 'none',
          wordBreak: 'keep-all',
          overflowWrap: 'normal',
          overflow: 'visible',
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
              style={{
                display: 'inline-block',
                whiteSpace: 'nowrap',
                overflow: 'visible',
              }}
            >
              {group.chars.map((c) => {
                const base: CSSProperties = {
                  display: 'inline-block',
                  color: resolvedColor,
                  // solid glyph + zero-blur shadow as resting state
                  textShadow: `0 0 0 ${resolvedColor}`,
                  willChange: phase === 'appearing' ? 'transform, opacity, text-shadow' : undefined,
                };

                if (phase === 'hidden') {
                  return (
                    <span
                      key={c.globalIdx}
                      style={{ ...base, opacity: 0 }}
                      aria-hidden
                    >
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

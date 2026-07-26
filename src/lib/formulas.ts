/**
 * Shared field-math formulas (pure functions).
 */

export const F = {
  n: (n: number, d = 2) => (Number.isFinite(n) ? n.toFixed(d) : '–'),
  c: (n: number) =>
    Number.isFinite(n) ? Math.round(n).toLocaleString() : '–',
  circleArea: (d: number) => Math.PI * (d / 2) * (d / 2),
  cylVol: (d: number, l: number) => F.circleArea(d) * l,
  avf: (sg: number, wd = 8.33) => (sg > 0 && wd > 0 ? 1 / (sg * wd) : 0),
  slurryYield: (ppa: number, avf: number) => ppa * avf + 1,
  gpm: (rate: number, gpt: number, fa = 1) => rate * 0.042 * gpt * fa,
  hydrostatic: (dens: number, tvd: number) => dens * tvd * 0.05195,
  flushVol: (depth: number, id: number) => 0.0009714 * id * id * depth,
  bhp: (t: number, h: number, f: number) => t + h - f,
  hhp: (rate: number, psi: number) => (rate * psi) / 40.8,
  ironVel: (rateBPM: number, idIn: number) => {
    if (idIn <= 0) return 0;
    const aFt2 = Math.PI * Math.pow(idIn / 24, 2);
    const rFt3s = (rateBPM * 5.6146) / 60;
    return rFt3s / aFt2;
  },
  capBblFt: (idIn: number) => (idIn > 0 ? (idIn * idIn) / 1029.44 : 0),
  convertUnit: (
    val: number,
    cat: string,
    from: string,
    to: string,
    categories: Record<
      string,
      { toBase: Record<string, number> }
    >,
  ) => {
    const category = categories[cat];
    if (!category) return val;
    const baseFrom = category.toBase[from] ?? 1;
    const baseTo = category.toBase[to] ?? 1;
    return (val * baseFrom) / baseTo;
  },
};

export type FormulaApi = typeof F;

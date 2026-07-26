import { useMemo, useState } from 'react';
import { F } from '../../lib/formulas';
import { useNavigation } from '../../context/NavigationContext';
import { useCalcState } from '../../context/CalcStateContext';
import { ToolCard } from '../../components/tools/ToolCard';
import { NumField, ResultTile } from '../../components/ui/NumField';
import { BASE_GEARS, EXTRA_GEARS } from '../shared/fieldData';

const TAB = 'hp';

const GEAR_RATIOS: Record<string, Record<number, number>> = {
  'TH55-E70': { 1: 6.248, 2: 4.585, 3: 3.378, 4: 2.484, 5: 1.831, 6: 1.357, 7: 1.0 },
  CX48: { 1: 3.339, 2: 2.453, 3: 2.2, 4: 1.808, 5: 1.616, 6: 1.359, 7: 1.191, 8: 0.999 },
  Allison: { 1: 3.75, 2: 2.69, 3: 2.2, 4: 1.77, 5: 1.58, 6: 1.27, 7: 1.0, 8: 0.72 },
  'TH55-E90': {
    1: 4.672,
    2: 3.429,
    3: 3.029,
    4: 2.526,
    5: 2.222,
    6: 1.849,
    7: 1.638,
    8: 1.357,
    9: 1.0,
  },
  TH350: { 1: 2.52, 2: 1.52, 3: 1.0 },
};

const PUMP_SPECS: Record<
  string,
  { bore: number; stroke: number; plungers: number; bblPerRev: number; maxPsi: number }
> = {
  SPM_TWS_2250: { bore: 4.5, stroke: 8, plungers: 3, bblPerRev: 0.0393, maxPsi: 15000 },
  SPM_TWS_2500: { bore: 4.5, stroke: 10, plungers: 3, bblPerRev: 0.0492, maxPsi: 15000 },
  CAT_WS255: { bore: 4.5, stroke: 8, plungers: 5, bblPerRev: 0.0656, maxPsi: 12100 },
  GD_2500Q: { bore: 4.5, stroke: 8, plungers: 5, bblPerRev: 0.0656, maxPsi: 12400 },
};

const ALL_GEAR_RATES: Record<number, number> = {
  1: 4.2,
  2: 4.9,
  3: 5.7,
  4: 6.8,
  5: 7.9,
  6: 9.3,
  7: 10.7,
  8: 12.4,
  9: 14.6,
};

type GoSolution = {
  gearCounts: Record<number, number>;
  achievedRate: number;
  error: number;
  spread: number;
  numTypes: number;
  midCount: number;
  midPct: number;
  score: number;
};

function gearOrd(n: number) {
  if (n === 1) return '1st';
  if (n === 2) return '2nd';
  if (n === 3) return '3rd';
  return `${n}th`;
}

function gearLabel(g: number) {
  return `${gearOrd(g)} Gear`;
}

function goSolve(
  numPumps: number,
  target: number,
  gears: [number, number][],
): GoSolution[] {
  const candidates: GoSolution[] = [];
  const counts: Record<number, number> = {};

  function bt(idx: number, rem: number, rate: number) {
    if (idx === gears.length) {
      if (rem !== 0) return;
      let mid = 0;
      let minG = 999;
      let maxG = 0;
      let used = 0;
      for (const [gStr, c] of Object.entries(counts)) {
        const gc = +gStr;
        const cnt = +c;
        if (cnt > 0) {
          used++;
          if (gc >= 4 && gc <= 6) mid += cnt;
          minG = Math.min(minG, gc);
          maxG = Math.max(maxG, gc);
        }
      }
      const spread = used > 0 ? maxG - minG : 0;
      const midPct = (mid / numPumps) * 100;
      const err = Math.abs(rate - target);
      const score = err * 1200 + spread * 25 + used * 12 - midPct * 4;
      candidates.push({
        gearCounts: { ...counts },
        achievedRate: rate,
        error: err,
        spread,
        numTypes: used,
        midCount: mid,
        midPct,
        score,
      });
      return;
    }
    const [g, r] = gears[idx];
    for (let c = 0; c <= rem; c++) {
      counts[g] = c;
      bt(idx + 1, rem - c, rate + c * r);
    }
    counts[g] = 0;
  }

  bt(0, numPumps, 0);
  return candidates.sort((a, b) => a.score - b.score).slice(0, 5);
}

export function HpPage() {
  const { tab } = useNavigation();
  const active = tab === 'hp';
  const { cleanRate, setCleanRate } = useCalcState();

  // Stage energy
  const [psi, setPsi] = useState(8500);
  const [pumps, setPumps] = useState(12);
  const [totPumps, setTotPumps] = useState(14);
  const [rating, setRating] = useState(2500);
  const [mechEff, setMechEff] = useState(90);

  // Hose counts
  const [hoseClean, setHoseClean] = useState(120);
  const [hoseDirty, setHoseDirty] = useState(95);

  // Torque
  const [tRpm, setTRpm] = useState(2100);
  const [tLbFt, setTLbFt] = useState(5625);
  const [tInHp, setTInHp] = useState(2250);

  // Pump disp
  const [pdBore, setPdBore] = useState(4.5);
  const [pdStroke, setPdStroke] = useState(8);
  const [pdPlungers, setPdPlungers] = useState(3);
  const [pdPinion, setPdPinion] = useState(1500);
  const [pdRatio, setPdRatio] = useState(6.353);
  const [pdEff, setPdEff] = useState(95);

  // Iron limit
  const [ilId, setIlId] = useState(3.0);
  const [ilHhp, setIlHhp] = useState(22500);
  const [ilRate, setIlRate] = useState(85);

  // Transmission
  const [transType, setTransType] = useState('TH55-E70');
  const [transGear, setTransGear] = useState(1);
  const [transEngine, setTransEngine] = useState(1800);

  // Pump rate from fluid end
  const [prType, setPrType] = useState('SPM_TWS_2250');
  const [prEff, setPrEff] = useState(95);
  const [prPe, setPrPe] = useState(283);

  // Gear optimizer
  const [goPumps, setGoPumps] = useState(14);
  const [goTarget, setGoTarget] = useState(100);
  const [goExtreme, setGoExtreme] = useState(false);
  const [goSols, setGoSols] = useState<GoSolution[]>([]);
  const [goSelIdx, setGoSelIdx] = useState(0);
  const [goShow, setGoShow] = useState(false);
  const [goBusy, setGoBusy] = useState(false);

  const rate = cleanRate;

  // Stage energy
  const totalHhp = F.hhp(rate, psi);
  const perPump = pumps > 0 ? totalHhp / pumps : 0;
  const locAvail = totPumps * rating;
  const activeCap = pumps * rating;
  const activeLoad = activeCap > 0 ? (totalHhp / activeCap) * 100 : 0;
  const totalLoad = locAvail > 0 ? (totalHhp / locAvail) * 100 : 0;
  const reqBhp = mechEff > 0 ? totalHhp / (mechEff / 100) : totalHhp;

  // Hoses
  const suction = Math.ceil(hoseClean / 10);
  const discharge = Math.ceil(hoseDirty / 15);

  // Torque
  const tBhp = tRpm > 0 ? (tLbFt * tRpm) / 5252 : 0;
  const tOutLbFt = tRpm > 0 ? (tInHp * 5252) / tRpm : 0;

  // Pump disp
  const bblRev =
    pdPlungers * ((Math.PI * Math.pow(pdBore, 2) * pdStroke) / 38808);
  const crank = pdRatio > 0 ? pdPinion / pdRatio : 0;
  const pumpBpm = (pdEff / 100) * bblRev * crank;

  // Iron
  const maxRate = 2 * ilId ** 2;
  const maxPsi = ilRate > 0 ? (ilHhp * 40.8) / ilRate : 0;

  // Transmission
  const gearKeys = Object.keys(GEAR_RATIOS[transType] || {})
    .map(Number)
    .sort((a, b) => a - b);
  const gearRatio = GEAR_RATIOS[transType]?.[transGear] ?? 1;
  const transOutput = gearRatio > 0 ? transEngine / gearRatio : 0;

  // Pump rate
  const spec = PUMP_SPECS[prType] || PUMP_SPECS.SPM_TWS_2250;
  const prBpm = (prEff / 100) * spec.bblPerRev * prPe;

  // Gear range display
  const activeGears = useMemo(
    () => (goExtreme ? [...BASE_GEARS, ...EXTRA_GEARS] : [...BASE_GEARS]),
    [goExtreme],
  );
  const goMin = goPumps * (activeGears[0]?.[1] ?? 0);
  const goMax = goPumps * (activeGears[activeGears.length - 1]?.[1] ?? 0);

  const best = goSols[goSelIdx];

  const fieldNotes = useMemo(() => {
    if (!best) return [] as string[];
    const notes: string[] = [];
    const mp = Math.round(best.midPct);
    notes.push(
      best.midPct >= 70
        ? `Excellent mid-band concentration — ${mp}% of pumps in 4th–6th gear. Very easy to fine-tune rate on the fly.`
        : `Good balance with ${mp}% in the preferred 4th–6th band.`,
    );
    if (best.spread <= 2)
      notes.push(`Very tight spread (${best.spread} gears) — ideal for location monitoring.`);
    else if (best.spread <= 4)
      notes.push(`Manageable spread of ${best.spread} gears.`);
    if ((best.gearCounts[8] || 0) > 0 || (best.gearCounts[9] || 0) > 0)
      notes.push('⚠️ Extreme gears active. Only approved for critical rate situations.');
    notes.push(
      'Assign the largest group to one pump line or color-code for quick visual checks on location.',
    );
    return notes;
  }, [best]);

  const runOptimizer = () => {
    setGoBusy(true);
    // Defer heavy solve so UI can paint busy state
    setTimeout(() => {
      const sols = goSolve(goPumps, goTarget, activeGears);
      setGoSols(sols);
      setGoSelIdx(0);
      setGoShow(sols.length > 0);
      setGoBusy(false);
    }, 10);
  };

  const onTransTypeChange = (type: string) => {
    setTransType(type);
    const keys = Object.keys(GEAR_RATIOS[type] || {})
      .map(Number)
      .sort((a, b) => a - b);
    setTransGear(keys[0] ?? 1);
  };

  return (
    <div className={`section${active ? ' active' : ''}`} id="s-hp">
      <div className="mb-4">
        <div className="sec-title">HORSEPOWER, HOSES &amp; IRON</div>
        <div className="sec-sub">CALCULATIONS</div>
      </div>

      <ToolCard title="Stage Energy Analysis" tab={TAB}>
        <div className="flex gap-3 mb-3">
          <NumField label="Treating PSI" value={psi} onChange={setPsi} />
          <NumField label="Active Pumps" value={pumps} onChange={(v) => setPumps(Math.max(1, Math.round(v)))} />
        </div>
        <div className="mb-3">
          <label className="lbl">
            Clean Rate (BPM){' '}
            <span
              style={{
                fontWeight: 400,
                textTransform: 'none',
                letterSpacing: 0,
                color: 'var(--brand)',
              }}
            >
              — shared with Chem &amp; Hydration
            </span>
          </label>
          <input
            type="number"
            className="field"
            value={rate}
            step={0.1}
            onChange={(e) => setCleanRate(parseFloat(e.target.value) || 0)}
          />
        </div>
        <div className="grid-3 mb-1">
          <NumField
            label="Total Pumps on Loc"
            value={totPumps}
            onChange={(v) => setTotPumps(Math.max(1, Math.round(v)))}
          />
          <NumField label="Pump HP Rating" value={rating} onChange={setRating} />
          <NumField label="Efficiency (%)" value={mechEff} onChange={setMechEff} />
        </div>
      </ToolCard>

      <div className="brand-card mb-4 text-center">
        <div className="lbl" style={{ color: 'rgba(255,255,255,0.6)', display: 'block' }}>
          Total Required Horsepower (HHP)
        </div>
        <div className="font-display" style={{ fontSize: 52, fontWeight: 900, color: '#fff' }}>
          {F.c(totalHhp)}
        </div>
        <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', marginTop: 4 }}>
          Based on {rate.toFixed(1)} BPM load
        </div>
      </div>

      <ToolCard title="Fleet Capacity, Load Factor & Engine BHP" tab={TAB}>
        <div className="grid-2 gap-2 mb-3">
          <ResultTile label="HHP per Active Pump" value={F.c(perPump)} unit="HHP" emphasize />
          <ResultTile label="Engine BHP Required" value={F.c(reqBhp)} unit="BHP (@ Eff%)" emphasize />
        </div>
        <div className="grid-3 gap-2">
          <ResultTile label="Total Location Cap" value={F.c(locAvail)} unit="HHP" />
          <ResultTile label="Active Fleet Load" value={`${activeLoad.toFixed(1)}%`} unit="% LOAD" />
          <ResultTile label="Total Location Load" value={`${totalLoad.toFixed(1)}%`} unit="% LOAD" />
        </div>
      </ToolCard>

      <ToolCard title="Suction / Discharge Hose Count" tab={TAB}>
        <div className="grid-2 mb-3">
          <NumField label="Max Clean Rate (BPM)" value={hoseClean} onChange={setHoseClean} />
          <NumField label="Max Dirty Rate (BPM)" value={hoseDirty} onChange={setHoseDirty} />
        </div>
        <div className="flex gap-3">
          <ResultTile label="# Suction Hoses" value={suction} unit="(Clean ÷ 10)" emphasize />
          <ResultTile label="# Discharge Hoses" value={discharge} unit="(Dirty ÷ 15)" />
        </div>
      </ToolCard>

      <ToolCard title="Engine Torque ↔ Horsepower Calculator" tab={TAB}>
        <div className="grid-2 mb-3">
          <NumField label="Engine Speed (RPM)" value={tRpm} onChange={setTRpm} />
          <NumField label="Torque (LBF-FT)" value={tLbFt} onChange={setTLbFt} />
        </div>
        <div className="flex gap-3 mb-3">
          <ResultTile label="Calculated BHP" value={F.c(tBhp)} unit="HP" emphasize />
        </div>
        <div style={{ background: 'var(--surface)', padding: 12, borderRadius: 10 }}>
          <div className="lbl mb-2">Back-Calculate Torque from Horsepower</div>
          <div className="flex gap-3 items-end">
            <NumField label="Horsepower (HP)" value={tInHp} onChange={setTInHp} />
            <ResultTile label="Calculated Torque" value={F.c(tOutLbFt)} unit="LBF-FT" emphasize />
          </div>
        </div>
      </ToolCard>

      <ToolCard title="Pump Displacement & Crank Speed Calculator" tab={TAB}>
        <div className="grid-3 mb-3">
          <NumField label="Plunger Bore (IN)" value={pdBore} onChange={setPdBore} step="0.25" />
          <NumField label="Stroke Length (IN)" value={pdStroke} onChange={setPdStroke} step="0.5" />
          <NumField
            label="Plungers Count"
            value={pdPlungers}
            onChange={(v) => setPdPlungers(Math.max(1, Math.round(v)))}
          />
          <NumField label="Pinion Speed (RPM)" value={pdPinion} onChange={setPdPinion} />
          <NumField label="Pinion Ratio" value={pdRatio} onChange={setPdRatio} step="0.001" />
          <NumField label="Efficiency (%)" value={pdEff} onChange={setPdEff} />
        </div>
        <div className="grid-3 gap-2">
          <ResultTile label="Vol / Rev" value={bblRev.toFixed(4)} unit="BBL/REV" />
          <ResultTile label="Crank Speed" value={crank.toFixed(1)} unit="RPM" />
          <ResultTile label="Pump Output" value={pumpBpm.toFixed(1)} unit="BPM" emphasize />
        </div>
      </ToolCard>

      <ToolCard title="Iron Rate Limit & Max Pressure" tab={TAB}>
        <div className="grid-3 mb-3">
          <NumField label="Iron Line ID (IN)" value={ilId} onChange={setIlId} step="0.1" />
          <NumField label="Total Available HHP" value={ilHhp} onChange={setIlHhp} />
          <NumField label="Slurry Rate (BPM)" value={ilRate} onChange={setIlRate} />
        </div>
        <div className="flex gap-3">
          <ResultTile label="Max Rate / Line (2 × ID²)" value={maxRate.toFixed(1)} unit="BPM/LINE" emphasize />
          <ResultTile label="Max Pressure at Rate" value={F.c(maxPsi)} unit="PSI" emphasize />
        </div>
      </ToolCard>

      <ToolCard title="Transmission Output Speed" tab={TAB}>
        <div className="grid-2 mb-3">
          <div>
            <label className="lbl">Transmission Type</label>
            <select
              className="field"
              value={transType}
              onChange={(e) => onTransTypeChange(e.target.value)}
            >
              <option value="TH55-E70">TH55-E70</option>
              <option value="CX48">CX48-P2300/TH48</option>
              <option value="Allison">Allison 9826</option>
              <option value="TH55-E90">TH55-E90</option>
              <option value="TH350">TH-350</option>
            </select>
          </div>
          <div>
            <label className="lbl">Current Gear</label>
            <select
              className="field"
              value={transGear}
              onChange={(e) => setTransGear(parseInt(e.target.value, 10))}
            >
              {gearKeys.map((g) => (
                <option key={g} value={g}>
                  {gearOrd(g)}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="mb-3">
          <NumField label="Deck Engine RPM" value={transEngine} onChange={setTransEngine} className="" />
        </div>
        <ResultTile
          label="Transmission Output Speed"
          value={F.c(transOutput)}
          unit="RPM — Pinion Speed for pump calc"
          emphasize
          className="tile"
        />
      </ToolCard>

      <ToolCard title="Pump Rate from Fluid End Specs" tab={TAB}>
        <div className="grid-2 mb-3">
          <div>
            <label className="lbl">Pump Type</label>
            <select className="field" value={prType} onChange={(e) => setPrType(e.target.value)}>
              <option value="SPM_TWS_2250">SPM TWS 2250</option>
              <option value="SPM_TWS_2500">SPM TWS 2500</option>
              <option value="CAT_WS255">CAT WS255</option>
              <option value="GD_2500Q">GD 2500 Q</option>
            </select>
          </div>
          <NumField label="Efficiency %" value={prEff} onChange={setPrEff} />
        </div>
        <div className="mb-3">
          <NumField label="PE RPM (from transmission)" value={prPe} onChange={setPrPe} className="" />
        </div>
        <ResultTile
          label="Pump Rate"
          value={prBpm.toFixed(1)}
          unit={`BPM — Max Pressure: ${spec.maxPsi.toLocaleString()} psi`}
          emphasize
          className="tile"
        />
      </ToolCard>

      <ToolCard title="High-Rate Gear Optimizer" tab={TAB}>
        <div className="mb-4">
          <label className="lbl">Pumps Inline</label>
          <div className="flex gap-2 items-center mb-1">
            <input
              type="number"
              className="field"
              value={goPumps}
              min={1}
              max={30}
              style={{ width: 90 }}
              onChange={(e) => setGoPumps(Math.max(1, Math.min(30, parseInt(e.target.value, 10) || 1)))}
            />
            <div className="flex gap-1">
              {[10, 12, 14, 16].map((n) => (
                <button
                  key={n}
                  type="button"
                  className={`quick-btn${goPumps === n ? ' sel' : ''}`}
                  onClick={() => setGoPumps(n)}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>
          <div style={{ fontSize: 10, color: 'var(--text2)', marginTop: 4 }}>
            Range: {goMin.toFixed(1)} – {goMax.toFixed(1)} BPM
          </div>
        </div>

        <div className="flex gap-3 items-end mb-4">
          <div className="flex-1">
            <NumField
              label="Target Total Rate (BPM)"
              value={goTarget}
              onChange={setGoTarget}
              step="0.1"
              className=""
            />
          </div>
          <button
            type="button"
            id="go-btn"
            className="btn btn-brand"
            style={{ padding: '10px 20px', whiteSpace: 'nowrap' }}
            onClick={runOptimizer}
            disabled={goBusy}
          >
            {goBusy ? '⏳ Calculating…' : '⚡ Optimize'}
          </button>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: 12,
            background: 'var(--surface)',
            borderRadius: 12,
          }}
        >
          <div>
            <div style={{ fontSize: 13, fontWeight: 600 }}>Extreme Mode (8th &amp; 9th gear)</div>
            <div style={{ fontSize: 11, color: 'var(--text2)', marginTop: 2 }}>
              Only for rate-critical jobs when 7th gear is insufficient
            </div>
          </div>
          <label className="toggle">
            <input
              type="checkbox"
              checked={goExtreme}
              onChange={(e) => setGoExtreme(e.target.checked)}
            />
            <div className="toggle-track" />
            <div className="toggle-thumb" />
          </label>
        </div>
      </ToolCard>

      {goShow && best && (
        <>
          <div className="flex gap-3 mb-4">
            <div className="card flex-1">
              <div className="lbl mb-1">Best Match</div>
              <div className="flex items-baseline gap-1">
                <div
                  className="font-display"
                  style={{ fontSize: 36, fontWeight: 900, color: 'var(--brand)' }}
                >
                  {best.achievedRate.toFixed(1)}
                </div>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text2)' }}>BPM</div>
              </div>
              <div style={{ marginTop: 6 }}>
                {best.error < 0.05 ? (
                  <span className="badge badge-green">✓ EXACT MATCH</span>
                ) : (
                  <span className="badge badge-yellow">
                    {best.error.toFixed(1)} BPM{' '}
                    {best.achievedRate > goTarget ? 'over' : 'under'}
                  </span>
                )}
              </div>
            </div>
            <div
              className="brand-card text-center flex-col"
              style={{
                minWidth: 110,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 4,
              }}
            >
              <div className="lbl" style={{ color: 'rgba(255,255,255,0.6)' }}>
                Mid-Band
              </div>
              <div className="font-display" style={{ fontSize: 40, fontWeight: 900, color: '#fff' }}>
                {Math.round(best.midPct)}%
              </div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.6)' }}>4th–6th gear</div>
            </div>
          </div>

          <ToolCard title="Gear Assignment" tab={TAB}>
            <div style={{ overflowX: 'auto' }}>
              <div className="tbl-wrap">
                <table className="tbl">
                  <thead>
                    <tr>
                      <th style={{ textAlign: 'left', width: '32%' }}>Gear</th>
                      <th className="tbl-right">Pumps</th>
                      <th className="tbl-right">Rate</th>
                      <th className="tbl-right">Contrib</th>
                      <th className="tbl-right">Fleet</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.from({ length: 9 }, (_, i) => i + 1).map((g) => {
                      const cnt = best.gearCounts[g] || 0;
                      if (!cnt) return null;
                      const isMid = g >= 4 && g <= 6;
                      const gr = ALL_GEAR_RATES[g] || 0;
                      const pct = Math.round((cnt / goPumps) * 100);
                      return (
                        <tr key={g} className={isMid ? 'gear-mid-row' : undefined}>
                          <td style={{ fontWeight: 700, padding: '9px 6px' }}>{gearLabel(g)}</td>
                          <td
                            className="tbl-right font-display"
                            style={{
                              fontWeight: 900,
                              color: isMid ? 'var(--brand)' : 'var(--text)',
                              padding: '9px 6px',
                            }}
                          >
                            {cnt}
                          </td>
                          <td
                            className="tbl-right"
                            style={{
                              color: 'var(--text2)',
                              fontFamily: 'monospace',
                              padding: '9px 6px',
                            }}
                          >
                            {gr.toFixed(1)}
                          </td>
                          <td
                            className="tbl-right"
                            style={{
                              fontFamily: 'monospace',
                              fontWeight: 600,
                              padding: '9px 6px',
                            }}
                          >
                            {(cnt * gr).toFixed(1)}
                          </td>
                          <td
                            className="tbl-right"
                            style={{
                              color: 'var(--text2)',
                              fontFamily: 'monospace',
                              padding: '9px 6px',
                            }}
                          >
                            {pct}%
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </ToolCard>

          {goSols.length > 1 && (
            <div className="mb-4">
              <div className="lbl mb-2" style={{ padding: '0 2px' }}>
                Alternative Distributions
              </div>
              <div>
                {goSols.slice(1, 4).map((sol, i) => {
                  const sum = Object.entries(sol.gearCounts)
                    .filter(([, c]) => c > 0)
                    .sort(([a], [b]) => +a - +b)
                    .map(([g, c]) => `${c}×${gearOrd(+g)}`)
                    .join(', ');
                  const sel = goSelIdx === i + 1;
                  return (
                    <div
                      key={i}
                      className={`alt-card${sel ? ' sel' : ''}`}
                      role="button"
                      tabIndex={0}
                      onClick={() => setGoSelIdx(i + 1)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') setGoSelIdx(i + 1);
                      }}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        padding: 12,
                        marginBottom: 8,
                        background: sel ? 'var(--surface2, var(--surface))' : 'var(--surface)',
                        borderRadius: 12,
                        border: sel ? '1px solid var(--brand)' : '1px solid var(--border)',
                        cursor: 'pointer',
                      }}
                    >
                      <div>
                        <div style={{ fontSize: 15, fontWeight: 700 }}>
                          {sol.achievedRate.toFixed(1)} BPM
                        </div>
                        <div style={{ fontSize: 11, color: 'var(--text2)', marginTop: 3 }}>
                          {sum}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="lbl" style={{ margin: '0 0 2px' }}>
                          MID-BAND
                        </div>
                        <div
                          className="font-display"
                          style={{ fontSize: 20, fontWeight: 900, color: 'var(--brand)' }}
                        >
                          {Math.round(sol.midPct)}%
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <ToolCard title="Field Management Notes" tab={TAB}>
            {fieldNotes.map((n) => (
              <div
                key={n}
                style={{
                  display: 'flex',
                  gap: 10,
                  alignItems: 'flex-start',
                  marginBottom: 8,
                }}
              >
                <span
                  style={{
                    color: 'var(--brand)',
                    fontSize: 12,
                    flexShrink: 0,
                    marginTop: 1,
                  }}
                >
                  ✓
                </span>
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 500,
                    color: 'var(--text)',
                    lineHeight: 1.4,
                  }}
                >
                  {n}
                </span>
              </div>
            ))}
          </ToolCard>
        </>
      )}
    </div>
  );
}

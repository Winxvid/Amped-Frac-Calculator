import { useState } from 'react';
import { F } from '../../lib/formulas';
import { useNavigation } from '../../context/NavigationContext';
import { ToolCard } from '../../components/tools/ToolCard';
import { NumField, ResultTile } from '../../components/ui/NumField';
import { TUBULAR_DATA } from '../shared/fieldData';

const TAB = 'wellbore';

type WellCapSection = {
  id: number;
  depth: number;
  tubular: string;
  idIn: number;
  odIn: number;
  galPerFt: number;
  bblPerFt: number;
  label: string;
  manualFactor: boolean;
};

let nextSecId = 1;

function capFromId(idIn: number) {
  if (idIn <= 0) return { bblPerFt: 0, galPerFt: 0 };
  const bblPerFt = (idIn * idIn) / 1029.44;
  return { bblPerFt, galPerFt: bblPerFt * 42 };
}

function defaultSection(): WellCapSection {
  const t = TUBULAR_DATA[7] || TUBULAR_DATA[0];
  return {
    id: nextSecId++,
    depth: 0,
    tubular: t.type,
    idIn: t.id,
    odIn: 0,
    galPerFt: t.factor,
    bblPerFt: t.factor / 42,
    label: t.type,
    manualFactor: false,
  };
}

export function WellborePage() {
  const { tab } = useNavigation();
  const active = tab === 'wellbore';

  // Tubular capacity
  const [tubOd, setTubOd] = useState(5.5);
  const [tubId, setTubId] = useState(4.778);
  const [tubLen, setTubLen] = useState(10500);

  // EMW
  const [emwStp, setEmwStp] = useState(6500);
  const [emwTvd, setEmwTvd] = useState(9500);
  const [emwDens, setEmwDens] = useState(8.33);
  const [emwTarget, setEmwTarget] = useState(22.0);

  // Flush / top of sand
  const [flPerf, setFlPerf] = useState(10500);
  const [flCap, setFlCap] = useState(0.0222);
  const [flPumped, setFlPumped] = useState(240);
  const [flSand, setFlSand] = useState(5000);
  const [flBulk, setFlBulk] = useState(105);

  // Perf drop
  const [pfRate, setPfRate] = useState(65);
  const [pfDens, setPfDens] = useState(9.2);
  const [pfN, setPfN] = useState(36);
  const [pfDiam, setPfDiam] = useState(0.42);
  const [pfCd, setPfCd] = useState(0.95);
  const [pfMeas, setPfMeas] = useState(400);

  // STP predictor
  const [stpBhp, setStpBhp] = useState(8500);
  const [stpDens, setStpDens] = useState(8.6);
  const [stpTvd, setStpTvd] = useState(9500);
  const [stpPipe, setStpPipe] = useState(1420);
  const [stpPerf, setStpPerf] = useState(338);

  // Well params
  const [wbTvd, setWbTvd] = useState(0);
  const [wbPerf, setWbPerf] = useState(0);
  const [wbDens, setWbDens] = useState(8.33);
  const [wbId, setWbId] = useState(4.778);
  const [wbTubular, setWbTubular] = useState(TUBULAR_DATA[7]?.type || TUBULAR_DATA[0].type);
  const [wbTreat, setWbTreat] = useState(0);
  const [wbFrict, setWbFrict] = useState(0);

  // Friction
  const [frRate, setFrRate] = useState(65);
  const [frDens, setFrDens] = useState(9.2);
  const [frDepth, setFrDepth] = useState(10500);
  const [frId, setFrId] = useState(4.778);
  const [frFPipe, setFrFPipe] = useState(0.00018);
  const [frFPerf, setFrFPerf] = useState(0.08);
  const [frMeasPipe, setFrMeasPipe] = useState(1500);

  // Well control
  const [wcForm, setWcForm] = useState(5200);
  const [wcTvd, setWcTvd] = useState(9500);
  const [wcGrad, setWcGrad] = useState(0.75);

  // Multi-section
  const [sections, setSections] = useState<WellCapSection[]>([]);

  // Frac gradient
  const [fgIsip, setFgIsip] = useState(6500);
  const [fgTvd, setFgTvd] = useState(9500);
  const [fgDens, setFgDens] = useState(8.6);
  const [fgClosure, setFgClosure] = useState(5800);

  // Prop left
  const [plSlurry, setPlSlurry] = useState(1200);
  const [plConc, setPlConc] = useState(3);
  const [plSg, setPlSg] = useState(2.65);

  // ── Tubular ──
  const capBblFt = tubId > 0 ? tubId ** 2 / 1029.44 : 0;
  const capGalFt = tubId > 0 ? tubId ** 2 / 24.509 : 0;
  const dispBblFt = tubOd > tubId ? (tubOd ** 2 - tubId ** 2) / 1029.44 : 0;
  const totCap = capBblFt * tubLen;
  const totDisp = dispBblFt * tubLen;

  // ── EMW ──
  const emwHydro = emwDens * emwTvd * 0.05195;
  const emwGrad = emwDens * 0.05195;
  const emwCalc = emwDens + (emwTvd > 0 ? emwStp / (emwTvd * 0.05195) : 0);
  const emwReqStp = (emwTarget - emwDens) * emwTvd * 0.05195;

  // ── Flush ──
  const flReq = flPerf * flCap;
  const flVar = flPumped - flReq;
  const sandHeight =
    flCap > 0 && flBulk > 0 ? flSand / (flCap * 5.61458 * flBulk) : 0;
  const topOfSand = flPerf - sandHeight;

  // ── Perf drop ──
  const pfDrop =
    pfN > 0 && pfDiam > 0 && pfCd > 0
      ? (0.2369 * pfDens * pfRate ** 2) /
        (pfN ** 2 * pfDiam ** 4 * pfCd ** 2)
      : 0;
  const solvedN =
    pfMeas > 0 && pfDiam > 0 && pfCd > 0
      ? Math.sqrt(
          (0.2369 * pfDens * pfRate ** 2) /
            (pfMeas * pfDiam ** 4 * pfCd ** 2),
        )
      : 0;

  // ── STP ──
  const stpHydro = stpDens * stpTvd * 0.05195;
  const stpCalc = stpBhp - stpHydro + stpPipe + stpPerf;

  // ── Well params ──
  const tub = TUBULAR_DATA.find((t) => t.type === wbTubular) || TUBULAR_DATA[7] || TUBULAR_DATA[0];
  const wbHydro = F.hydrostatic(wbDens, wbTvd);
  const wbFlush = F.flushVol(wbPerf, wbId);
  const wbBhp = F.bhp(wbTreat, wbHydro, wbFrict);

  // ── Friction ──
  const pipeFrict =
    frId > 0
      ? frFPipe * ((frDens * frRate ** 2) / frId ** 4) * (frDepth / frId)
      : 0;
  const perfFrict = frFPerf * frRate ** 2;
  const totalFrict = pipeFrict + perfFrict;
  const frDenom =
    frId > 0 ? ((frDens * frRate ** 2) / frId ** 4) * (frDepth / frId) : 0;
  const solvedFPipe = frDenom > 0 ? frMeasPipe / frDenom : 0;

  // ── Well control ──
  const killMud = wcTvd > 0 ? wcForm / (wcTvd * 0.05195) : 0;
  const fracPress = wcGrad * wcTvd;
  const reqIsip = fracPress - 8.33 * wcTvd * 0.05195;

  // ── Multi-section totals ──
  const totalBbl = sections.reduce((s, r) => s + (r.depth || 0) * (r.bblPerFt || 0), 0);
  const totalGal = sections.reduce((s, r) => s + (r.depth || 0) * (r.galPerFt || 0), 0);

  // ── Frac gradient ──
  const fgHydro = fgDens * fgTvd * 0.05195;
  const fgGrad = fgTvd > 0 ? fgIsip / fgTvd + 0.433 : 0;
  const fgNet = fgIsip + fgHydro - fgClosure;

  // ── Prop left: slurry*conc*42 / (conc/(sg*8.33)+1) ──
  const plDenom = plConc / (plSg * 8.33) + 1;
  const propLeft = plDenom > 0 ? (plSlurry * plConc * 42) / plDenom : 0;

  const onTubularSelect = (type: string) => {
    setWbTubular(type);
    const t = TUBULAR_DATA.find((x) => x.type === type);
    if (t) setWbId(t.id);
  };

  const updateSection = (id: number, patch: Partial<WellCapSection>) => {
    setSections((prev) =>
      prev.map((row) => {
        if (row.id !== id) return row;
        const next = { ...row, ...patch };

        if (patch.tubular !== undefined) {
          if (patch.tubular === 'custom') {
            next.tubular = 'custom';
            next.manualFactor = false;
          } else {
            const t = TUBULAR_DATA.find((x) => x.type === patch.tubular);
            if (t) {
              next.tubular = t.type;
              next.idIn = t.id;
              next.odIn = 0;
              next.galPerFt = t.factor;
              next.bblPerFt = t.factor / 42;
              next.manualFactor = false;
              next.label = t.type;
            }
          }
        }

        if (patch.idIn !== undefined && next.tubular === 'custom' && !next.manualFactor) {
          const caps = capFromId(patch.idIn);
          next.bblPerFt = caps.bblPerFt;
          next.galPerFt = caps.galPerFt;
        }

        if (patch.galPerFt !== undefined) {
          next.galPerFt = patch.galPerFt;
          next.bblPerFt = patch.galPerFt / 42;
          next.manualFactor = true;
        }

        if (patch.bblPerFt !== undefined && patch.galPerFt === undefined) {
          next.bblPerFt = patch.bblPerFt;
          next.galPerFt = patch.bblPerFt * 42;
          next.manualFactor = true;
        }

        return next;
      }),
    );
  };

  return (
    <div className={`section${active ? ' active' : ''}`} id="s-wellbore">
      <div className="mb-4">
        <div className="sec-title">WELLBORE CALCULATIONS</div>
        <div className="sec-sub">FLUSH VOLUME FORMULAS - FORMATION FORMULAS</div>
      </div>

      <ToolCard title="Tubular Capacity, Displacement & Metal Volume" tab={TAB}>
        <div className="grid-3 mb-3">
          <NumField label="Outer Diam OD (IN)" value={tubOd} onChange={setTubOd} step="0.1" />
          <NumField label="Inner Diam ID (IN)" value={tubId} onChange={setTubId} step="0.001" />
          <NumField label="Depth / Length (FT)" value={tubLen} onChange={setTubLen} />
        </div>
        <div className="grid-3 gap-2 mb-3">
          <ResultTile label="Capacity (BBL/FT)" value={capBblFt.toFixed(4)} unit="BBL/FT" emphasize />
          <ResultTile label="Capacity (GAL/FT)" value={capGalFt.toFixed(3)} unit="GAL/FT" />
          <ResultTile label="Displacement (BBL/FT)" value={dispBblFt.toFixed(4)} unit="BBL/FT" />
        </div>
        <div className="flex gap-3">
          <ResultTile label="Total Internal Volume" value={totCap.toFixed(1)} unit="BBL" emphasize />
          <ResultTile label="Total Metal Displacement" value={totDisp.toFixed(1)} unit="BBL" />
        </div>
      </ToolCard>

      <ToolCard title="Equivalent Mud Weight (EMW) & Surface Pressure" tab={TAB}>
        <div className="grid-2 mb-3">
          <NumField label="Surface Pressure (PSI)" value={emwStp} onChange={setEmwStp} />
          <NumField label="True Vertical Depth TVD (FT)" value={emwTvd} onChange={setEmwTvd} />
          <NumField label="Base Fluid Density (PPG)" value={emwDens} onChange={setEmwDens} step="0.01" />
          <NumField label="Target EMW (PPG)" value={emwTarget} onChange={setEmwTarget} step="0.1" />
        </div>
        <div className="grid-3 gap-2 mb-3">
          <ResultTile label="Hydrostatic Press" value={F.c(emwHydro)} unit="PSI" />
          <ResultTile label="Hydro Gradient" value={emwGrad.toFixed(3)} unit="PSI/FT" />
          <ResultTile label="Calculated EMW" value={emwCalc.toFixed(2)} unit="PPG" emphasize />
        </div>
        <ResultTile
          label="Req Surface Pressure for Target EMW"
          value={F.c(emwReqStp)}
          unit="PSI"
          emphasize
          className="tile"
        />
      </ToolCard>

      <ToolCard title="Overflush / Underflush & Top of Proppant (PBTD)" tab={TAB}>
        <div className="grid-3 mb-3">
          <NumField label="Perf Depth (FT)" value={flPerf} onChange={setFlPerf} />
          <NumField label="Casing Capacity (BBL/FT)" value={flCap} onChange={setFlCap} step="0.0001" />
          <NumField label="Pumped Flush Vol (BBL)" value={flPumped} onChange={setFlPumped} />
          <NumField label="Sand Left in Casing (LBS)" value={flSand} onChange={setFlSand} />
          <NumField label="Sand Bulk Density (LBS/FT³)" value={flBulk} onChange={setFlBulk} />
        </div>
        <div className="grid-2 gap-2 mb-3">
          <ResultTile label="Required Flush to Perfs" value={flReq.toFixed(1)} unit="BBL" />
          <ResultTile
            label="Flush Variance (Over/Under)"
            value={
              flVar >= 0
                ? `+${flVar.toFixed(1)} BBL (Overflush)`
                : `${flVar.toFixed(1)} BBL (Underflush)`
            }
            emphasize
          />
        </div>
        <div className="flex gap-3">
          <ResultTile label="Sand Height in Casing" value={sandHeight.toFixed(1)} unit="FT" />
          <ResultTile label="Top of Sand / PBTD" value={topOfSand.toFixed(1)} unit="FT" emphasize />
        </div>
      </ToolCard>

      <ToolCard title="Perforation Pressure Drop & Open Perfs Solver" tab={TAB}>
        <div className="grid-3 mb-3">
          <NumField label="Slurry Rate (BPM)" value={pfRate} onChange={setPfRate} />
          <NumField label="Slurry Density (PPG)" value={pfDens} onChange={setPfDens} step="0.1" />
          <NumField label="Open Perfs Count (N)" value={pfN} onChange={setPfN} />
          <NumField label="Perf Hole Diam (IN)" value={pfDiam} onChange={setPfDiam} step="0.01" />
          <NumField label="Discharge Coeff (Cd)" value={pfCd} onChange={setPfCd} step="0.01" />
        </div>
        <ResultTile
          label="Calculated Perf Pressure Drop"
          value={F.c(pfDrop)}
          unit="PSI"
          emphasize
          className="tile mb-3"
        />
        <div style={{ background: 'var(--surface)', padding: 12, borderRadius: 10 }}>
          <div className="lbl mb-2">Back-Calculate Open Perfs Count from Measured Drop</div>
          <div className="flex gap-3 items-end">
            <NumField label="Measured Perf Friction (PSI)" value={pfMeas} onChange={setPfMeas} />
            <ResultTile label="Solved Open Perfs" value={solvedN.toFixed(1)} unit="PERFS" emphasize />
          </div>
        </div>
      </ToolCard>

      <ToolCard title="Surface Treating Pressure (STP) Predictor" tab={TAB}>
        <div className="grid-3 mb-3">
          <NumField label="Target BHP (PSI)" value={stpBhp} onChange={setStpBhp} />
          <NumField label="Fluid Density (PPG)" value={stpDens} onChange={setStpDens} step="0.1" />
          <NumField label="TVD (FT)" value={stpTvd} onChange={setStpTvd} />
          <NumField label="Pipe Friction (PSI)" value={stpPipe} onChange={setStpPipe} />
          <NumField label="Perf Friction (PSI)" value={stpPerf} onChange={setStpPerf} />
        </div>
        <div className="flex gap-3">
          <ResultTile label="Hydrostatic Pressure" value={F.c(stpHydro)} unit="PSI" />
          <ResultTile label="Calculated Required STP" value={F.c(stpCalc)} unit="PSI" emphasize />
        </div>
      </ToolCard>

      <ToolCard title="Well Parameters" tab={TAB}>
        <div className="grid-2 mb-3">
          <NumField label="TVD (FT)" value={wbTvd} onChange={setWbTvd} />
          <NumField label="Perf Depth (FT)" value={wbPerf} onChange={setWbPerf} />
          <NumField label="Water Density (PPG)" value={wbDens} onChange={setWbDens} step="0.01" />
          <NumField label="Casing ID (IN)" value={wbId} onChange={setWbId} step="0.001" />
        </div>
        <div>
          <label className="lbl">Tubular</label>
          <select
            className="field"
            value={wbTubular}
            onChange={(e) => onTubularSelect(e.target.value)}
          >
            {TUBULAR_DATA.map((t) => (
              <option key={t.type} value={t.type}>
                {t.type} — {t.factor.toFixed(4)} gal/ft (ID {t.id})
              </option>
            ))}
          </select>
        </div>
      </ToolCard>

      <ToolCard title="Well Volumetrics" tab={TAB}>
        <div className="flex gap-3 mb-3">
          <ResultTile label="Hydrostatic" value={F.c(wbHydro)} unit="PSI" emphasize />
        </div>
        <div className="brand-card flex justify-between items-center">
          <div>
            <div className="lbl" style={{ color: 'rgba(255,255,255,0.6)' }}>
              Total Wellbore Capacity
            </div>
            <div className="font-display" style={{ fontSize: 36, fontWeight: 900, color: '#fff' }}>
              {wbFlush.toFixed(2)}
            </div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)' }}>
              Calculated from casing ID to perfs
            </div>
          </div>
          <div className="text-right">
            <div
              style={{
                fontSize: 10,
                fontWeight: 800,
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.6)',
              }}
            >
              Tubular Factor
            </div>
            <div
              className="font-display"
              style={{ fontSize: 20, fontWeight: 900, color: 'rgba(255,255,255,0.8)' }}
            >
              {tub.factor.toFixed(4)}
            </div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)' }}>GAL/FT</div>
          </div>
        </div>
      </ToolCard>

      <ToolCard title="Friction Loss Breakdown & Pipe Friction Solver" tab={TAB}>
        <div className="grid-2 mb-3">
          <NumField label="Slurry Rate (BPM)" value={frRate} onChange={setFrRate} />
          <NumField label="Slurry Density (PPG)" value={frDens} onChange={setFrDens} step="0.1" />
          <NumField label="Perf Depth (FT)" value={frDepth} onChange={setFrDepth} />
          <NumField label="Casing ID (IN)" value={frId} onChange={setFrId} step="0.001" />
          <NumField label="Pipe Friction Coeff (f_pipe)" value={frFPipe} onChange={setFrFPipe} step="0.00001" />
          <NumField label="Perf Friction Coeff (f_perf)" value={frFPerf} onChange={setFrFPerf} step="0.01" />
        </div>
        <div className="grid-3 gap-2 mb-3">
          <ResultTile label="Pipe Friction" value={F.c(pipeFrict)} unit="PSI" />
          <ResultTile label="Perf Friction" value={F.c(perfFrict)} unit="PSI" />
          <ResultTile label="Total Friction" value={F.c(totalFrict)} unit="PSI" emphasize />
        </div>
        <div style={{ background: 'var(--surface)', padding: 12, borderRadius: 10 }}>
          <div className="lbl mb-2">Back-Calculate Pipe Friction Coefficient (f_pipe)</div>
          <div className="flex gap-3 items-end">
            <NumField label="Measured Pipe Friction (PSI)" value={frMeasPipe} onChange={setFrMeasPipe} />
            <ResultTile label="Solved f_pipe" value={solvedFPipe.toFixed(6)} emphasize />
          </div>
        </div>
      </ToolCard>

      <ToolCard title="Well Control & Fracture Pressure" tab={TAB}>
        <div className="grid-3 mb-3">
          <NumField label="Formation Pressure (PSI)" value={wcForm} onChange={setWcForm} />
          <NumField label="TVD (FT)" value={wcTvd} onChange={setWcTvd} />
          <NumField label="Frac Gradient (PSI/FT)" value={wcGrad} onChange={setWcGrad} step="0.01" />
        </div>
        <div className="grid-3 gap-2">
          <ResultTile label="Kill Mud Weight" value={killMud.toFixed(2)} unit="PPG" emphasize />
          <ResultTile label="Fracture Pressure" value={F.c(fracPress)} unit="PSI" />
          <ResultTile label="Required ISIP" value={F.c(reqIsip)} unit="PSI" />
        </div>
      </ToolCard>

      <ToolCard title="Bottom Hole Pressure (BHP)" tab={TAB}>
        <div className="flex gap-3 mb-3">
          <NumField label="Treating PSI" value={wbTreat} onChange={setWbTreat} />
          <NumField label="Friction Loss (PSI)" value={wbFrict} onChange={setWbFrict} />
        </div>
        <ResultTile label="BHP (PSI)" value={F.c(wbBhp)} emphasize className="tile" />
      </ToolCard>

      <ToolCard title="Wellbore Capacity (Multi-Section)" tab={TAB}>
        <div className="flex justify-between items-center mb-3">
          <p style={{ fontSize: 12, color: 'var(--text2)', margin: 0, flex: 1 }}>
            Pick a chart casing or enter custom OD/ID. BBL/FT = ID² ÷ 1029.44 · Chart factors are
            gal/ft so BBL = gal/42.
          </p>
          <button
            type="button"
            className="btn btn-brand"
            style={{ fontSize: 12, padding: '8px 14px', marginLeft: 12, whiteSpace: 'nowrap' }}
            onClick={() => setSections((s) => [...s, defaultSection()])}
          >
            + Add Section
          </button>
        </div>

        {sections.length === 0 && (
          <div style={{ fontSize: 13, color: 'var(--text2)', padding: 16, textAlign: 'center' }}>
            No sections yet. Tap “+ Add Section” to build the well string.
          </div>
        )}

        {sections.map((row, i) => {
          const isCustom = row.tubular === 'custom';
          const secBbl = (row.depth || 0) * (row.bblPerFt || 0);
          const secGal = (row.depth || 0) * (row.galPerFt || 0);
          return (
            <div
              key={row.id}
              className="mb-3"
              style={{
                background: 'var(--surface)',
                padding: 12,
                borderRadius: 10,
                border: '1px solid var(--border)',
              }}
            >
              <div className="flex justify-between items-center mb-2">
                <div className="lbl" style={{ margin: 0 }}>
                  Section {i + 1}
                </div>
                <button
                  type="button"
                  className="btn-danger"
                  onClick={() => setSections((s) => s.filter((r) => r.id !== row.id))}
                  title="Remove section"
                >
                  ✕
                </button>
              </div>
              <div className="grid-2 mb-2">
                <NumField
                  label="Section Depth / Length (FT)"
                  value={row.depth}
                  onChange={(v) => updateSection(row.id, { depth: v })}
                />
                <div>
                  <label className="lbl">Casing (Chart or Custom)</label>
                  <select
                    className="field"
                    value={row.tubular}
                    onChange={(e) => updateSection(row.id, { tubular: e.target.value })}
                  >
                    <option value="custom">Custom casing (enter OD / ID)</option>
                    {TUBULAR_DATA.map((t) => (
                      <option key={t.type} value={t.type}>
                        {t.type} — {t.factor.toFixed(4)} gal/ft (ID {t.id})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid-2 mb-2">
                <NumField
                  label={`Outer Diam OD (IN)${isCustom ? '' : ' — chart'}`}
                  value={row.odIn}
                  onChange={(v) =>
                    updateSection(row.id, { odIn: v, tubular: isCustom ? 'custom' : row.tubular })
                  }
                  step="any"
                />
                <NumField
                  label={`Inner Diam ID (IN)${isCustom ? ' — required' : ''}`}
                  value={row.idIn}
                  onChange={(v) => updateSection(row.id, { idIn: v, tubular: 'custom' })}
                  step="any"
                />
              </div>
              <div className="grid-2 mb-2">
                <NumField
                  label="Capacity (GAL/FT)"
                  value={Number(row.galPerFt.toFixed(4))}
                  onChange={(v) => updateSection(row.id, { galPerFt: v })}
                  step="any"
                />
                <NumField
                  label="Capacity (BBL/FT)"
                  value={Number(row.bblPerFt.toFixed(4))}
                  onChange={(v) => updateSection(row.id, { bblPerFt: v })}
                  step="any"
                />
              </div>
              <ResultTile
                label="Section Volume"
                value={`${secBbl.toFixed(2)} BBL · ${F.c(secGal)} GAL`}
                emphasize
                className="tile"
              />
            </div>
          );
        })}

        <div className="flex gap-3 mt-3">
          <ResultTile label="Total Gallons" value={F.c(totalGal)} unit="GAL" />
          <ResultTile label="Total Barrels" value={totalBbl.toFixed(2)} unit="BBL" emphasize />
        </div>
      </ToolCard>

      <ToolCard title="Frac Gradient & Related" tab={TAB}>
        <div className="grid-2 mb-3">
          <NumField label="ISIP (PSI)" value={fgIsip} onChange={setFgIsip} />
          <NumField label="TVD (FT)" value={fgTvd} onChange={setFgTvd} />
          <NumField label="Fluid Density (PPG)" value={fgDens} onChange={setFgDens} step="0.1" />
          <NumField label="Closure Stress (PSI)" value={fgClosure} onChange={setFgClosure} />
        </div>
        <div className="flex gap-3">
          <ResultTile label="Frac Gradient" value={fgGrad.toFixed(2)} unit="PSI/FT" emphasize />
          <ResultTile label="Net Pressure" value={F.c(fgNet)} unit="PSI" />
        </div>
      </ToolCard>

      <ToolCard title="Proppant Left in Wellbore" tab={TAB}>
        <div className="grid-2 mb-3">
          <NumField label="Slurry Volume (BBL)" value={plSlurry} onChange={setPlSlurry} />
          <NumField label="Prop Conc (PPG)" value={plConc} onChange={setPlConc} step="0.5" />
          <NumField label="Sand SG" value={plSg} onChange={setPlSg} step="0.05" />
        </div>
        <ResultTile
          label="Proppant Left in Wellbore"
          value={F.c(propLeft)}
          unit="LBS"
          emphasize
          className="tile"
        />
      </ToolCard>
    </div>
  );
}

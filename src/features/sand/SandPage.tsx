import { useMemo, useState, useEffect } from 'react';
import { F } from '../../lib/formulas';
import { useNavigation } from '../../context/NavigationContext';
import { SectionHeader } from '../../components/ui/SectionHeader';
import { ToolCard } from '../../components/tools/ToolCard';
import { NumField, ResultTile } from '../../components/ui/NumField';
import { PROPPANT_DATA } from '../shared/fieldData';
import { APP_STATE_KEY } from '../../lib/constants';

const TAB = 'sand';
type Inv = { id: number; name: string; designLbs: number; consumed: number; color: string };
type Stage = { id: number; name: string; totalDesignLbs: number; inv: Inv[] };

function loadStages(): { stages: Stage[]; stageIdx: number } {
  try {
    const raw = localStorage.getItem(APP_STATE_KEY);
    if (!raw) throw new Error('none');
    const d = JSON.parse(raw);
    if (Array.isArray(d.stages) && d.stages.length) {
      return { stages: d.stages, stageIdx: d.stageIdx || 0 };
    }
  } catch { /* */ }
  return {
    stages: [{ id: 1, name: 'Stage 1', totalDesignLbs: 0, inv: [] }],
    stageIdx: 0,
  };
}

function persistStages(stages: Stage[], stageIdx: number) {
  try {
    const raw = localStorage.getItem(APP_STATE_KEY);
    const d = raw ? JSON.parse(raw) : {};
    d.stages = stages;
    d.stageIdx = stageIdx;
    localStorage.setItem(APP_STATE_KEY, JSON.stringify(d));
  } catch { /* */ }
}

export function SandPage() {
  const { tab } = useNavigation();
  const active = tab === 'sand';
  const initial = loadStages();
  const [stages, setStages] = useState(initial.stages);
  const [stageIdx, setStageIdx] = useState(initial.stageIdx);

  const [bulkMass, setBulkMass] = useState(91);
  const [bulkVol, setBulkVol] = useState(1);
  const [snClean, setSnClean] = useState(5000);
  const [snPpg, setSnPpg] = useState(2);
  const [ppa, setPpa] = useState(2);
  const [sg, setSg] = useState(2.65);
  const [pcSlurry, setPcSlurry] = useState(80);
  const [pcClean, setPcClean] = useState(70);
  const [pcSg1, setPcSg1] = useState(2.65);
  const [pcCarrier, setPcCarrier] = useState(8.33);
  const [pcMeasured, setPcMeasured] = useState(9.5);
  const [pcSg2, setPcSg2] = useState(2.65);
  const [rStart, setRStart] = useState(0.5);
  const [rEnd, setREnd] = useState(2.5);
  const [rVol, setRVol] = useState(1000);
  const [augR, setAugR] = useState(6);
  const [shaftR, setShaftR] = useState(1);
  const [pitch, setPitch] = useState(10.5);
  const [bulk, setBulk] = useState(91);
  const [pprOld, setPprOld] = useState(28.4876);
  const [pprActual, setPprActual] = useState(100000);
  const [pprDesign, setPprDesign] = useState(95000);
  const [arRate, setArRate] = useState(80);
  const [arPpg, setArPpg] = useState(2);
  const [arPpr, setArPpr] = useState(28.4876);
  const [maTotal, setMaTotal] = useState(120);
  const [maCount, setMaCount] = useState(3);
  const [maThresh, setMaThresh] = useState(50);
  const [jpSlurry, setJpSlurry] = useState(50000);
  const [jpClean, setJpClean] = useState(40000);
  const [jpChem, setJpChem] = useState(500);

  useEffect(() => {
    persistStages(stages, stageIdx);
  }, [stages, stageIdx]);

  const st = stages[stageIdx] || stages[0];
  const stageActual = st?.inv.reduce((s, i) => s + (i.consumed || 0), 0) || 0;

  const bulkRes = bulkVol > 0 ? bulkMass / bulkVol : 0;
  const snLbs = snClean * 42 * snPpg;
  const waterDens = 8.33;
  const avfVal = 1 / (waterDens * sg);
  const cfr = 1 / (ppa / (sg * waterDens) + 1);
  const propYield = ppa * avfVal + 1;
  const slurryDens = waterDens + ppa / (ppa / (sg * waterDens) + 1);

  let ppa1 = 0;
  if (pcClean > 0 && pcSlurry >= pcClean) ppa1 = (pcSlurry / pcClean - 1) * 8.33 * pcSg1;
  let ppa2 = 0;
  const solidDens = pcSg2 * 8.33;
  if (pcMeasured > pcCarrier && pcMeasured < solidDens) {
    ppa2 = (pcMeasured - pcCarrier) / (1 - pcMeasured / solidDens);
  }
  const rAvg = (rStart + rEnd) / 2;
  const rTotal = rAvg * rVol * 42;
  const ppr = (1.41 * (augR ** 2 - shaftR ** 2) * pitch * bulk) / 1728;
  const pprNew = pprDesign > 0 ? pprOld * (pprActual / pprDesign) : pprOld;
  const totalRpm = arPpr > 0 ? (arRate * arPpg * 42) / arPpr : 0;
  const ppm = totalRpm * arPpr;
  const isOver = maTotal > maThresh * maCount;
  const augerRpms = useMemo(() => {
    if (isOver) return Array(maCount).fill(maTotal / maCount);
    const out: number[] = [];
    let rem = maTotal;
    for (let i = 0; i < maCount; i++) {
      const take = Math.min(rem, maThresh);
      out.push(take);
      rem -= take;
    }
    return out;
  }, [maTotal, maCount, maThresh, isOver]);
  const jpTotal = avfVal > 0 ? (jpSlurry - jpClean - jpChem) / avfVal : 0;

  const updateStage = (patch: Partial<Stage>) => {
    setStages((prev) =>
      prev.map((s, i) => (i === stageIdx ? { ...s, ...patch } : s)),
    );
  };

  return (
    <div className={`section${active ? ' active' : ''}`} id="s-sand">
      <SectionHeader
        tab={TAB}
        title="SAND CALCULATIONS"
        subtitle="SAND FUNDAMENTALS"
      />

      <ToolCard title="Sand Fundamentals Reference" tab={TAB}>
        <div className="grid-2 gap-2 mb-2">
          {[
            ['Specific Gravity (SG)', 'SG = Sand Density / Water Density'],
            ['Abs. Volume Factor (AVF)', 'AVF = 1 / (8.33 × SG)', 'Nat. Sand (SG 2.65): 0.0453 gal/lb'],
            ['Slurry Yield', 'Yield = (PPA × AVF) + 1', 'Gal slurry / Gal clean fluid'],
            ['Standard Source Water', '8.33 - 8.35 lbs/gal', 'Metric AVF = 0.00037736 m³/kg'],
          ].map(([t, f, n]) => (
            <div key={t} className="surface-card">
              <div className="lbl">{t}</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--brand)' }}>{f}</div>
              {n ? <div style={{ fontSize: 10, color: 'var(--text2)', marginTop: 2 }}>{n}</div> : null}
            </div>
          ))}
        </div>
      </ToolCard>

      <ToolCard title="Bulk Density Calculator & Reference" tab={TAB}>
        <div className="flex gap-3 mb-3">
          <NumField label="Measured Mass (LBS)" value={bulkMass} onChange={setBulkMass} />
          <NumField label="Measured Volume (FT³)" value={bulkVol} onChange={setBulkVol} step="0.1" />
        </div>
        <ResultTile label="Calculated Bulk Density" value={bulkRes.toFixed(2)} unit="LBS/FT³" emphasize className="tile mb-3" />
        <div className="lbl mb-2" style={{ fontSize: 11 }}>Standard Proppant Bulk Densities & SG</div>
        <div className="tbl-wrap">
          <table className="tbl">
            <thead>
              <tr>
                <th style={{ textAlign: 'left' }}>Proppant / Material Type</th>
                <th className="tbl-right">Bulk Density (lbs/ft³)</th>
                <th className="tbl-right">Specific Gravity (SG)</th>
              </tr>
            </thead>
            <tbody>
              {PROPPANT_DATA.map((p) => (
                <tr key={p.type}>
                  <td style={{ fontWeight: 600 }}>{p.type}</td>
                  <td className="tbl-right" style={{ fontWeight: 700, color: 'var(--brand)' }}>{p.bulk}</td>
                  <td className="tbl-right" style={{ fontFamily: 'monospace' }}>{p.sg.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ToolCard>

      <ToolCard
        title="Stages (Design vs Actual Tracking)"
        tab={TAB}
        badge={
          <button type="button" className="btn btn-brand" style={{ fontSize: 12, padding: '7px 14px' }}
            onClick={() => {
              const n = stages.length + 1;
              setStages((s) => [...s, { id: Date.now(), name: `Stage ${n}`, totalDesignLbs: 0, inv: [] }]);
              setStageIdx(stages.length);
            }}>+ Add Stage</button>
        }
      >
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', marginBottom: 12 }}>
          {stages.map((s, i) => (
            <button key={s.id} type="button" className={`tab-btn${i === stageIdx ? ' active' : ''}`} style={{ fontSize: 13 }}
              onClick={() => setStageIdx(i)}>{s.name}</button>
          ))}
        </div>
        {st && (
          <div className="card-sm mb-3">
            <div className="flex items-center gap-2 mb-3">
              <input type="text" className="field" value={st.name}
                onChange={(e) => updateStage({ name: e.target.value })} aria-label="Stage name" />
              {stages.length > 1 && (
                <button type="button" className="btn-danger" onClick={() => {
                  setStages((prev) => prev.filter((_, i) => i !== stageIdx));
                  setStageIdx((i) => Math.max(0, Math.min(i, stages.length - 2)));
                }}>✕</button>
              )}
            </div>
            <div className="flex gap-3">
              <NumField label="Total Design (LBS)" value={st.totalDesignLbs}
                onChange={(v) => updateStage({ totalDesignLbs: v })} />
              <ResultTile label="Total Actual" value={F.c(stageActual)} unit="LBS" emphasize />
            </div>
            <div className="flex justify-between items-center mt-3 mb-2">
              <div className="lbl" style={{ margin: 0 }}>Inventory Matrix</div>
              <button type="button" className="btn btn-brand" style={{ fontSize: 12, padding: '7px 14px' }}
                onClick={() => {
                  const cols = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6'];
                  updateStage({
                    inv: [...st.inv, {
                      id: Date.now(), name: 'NEW SAND', designLbs: 0, consumed: 0,
                      color: cols[st.inv.length % cols.length],
                    }],
                  });
                }}>+ Add</button>
            </div>
            {st.inv.length === 0 ? (
              <div style={{ color: 'var(--text2)', textAlign: 'center', padding: 16, fontSize: 13 }}>No sand types yet.</div>
            ) : st.inv.map((item, ti) => {
              const pct = item.designLbs > 0 ? Math.min((item.consumed / item.designLbs) * 100, 100) : 0;
              const rem = Math.max(0, item.designLbs - item.consumed);
              return (
                <div key={item.id} className="card-sm mb-3">
                  <div className="flex items-center gap-2 mb-3">
                    <input type="color" value={item.color} onChange={(e) => {
                      const inv = st.inv.map((x, i) => i === ti ? { ...x, color: e.target.value } : x);
                      updateStage({ inv });
                    }} />
                    <input type="text" className="field" value={item.name} onChange={(e) => {
                      const inv = st.inv.map((x, i) => i === ti ? { ...x, name: e.target.value } : x);
                      updateStage({ inv });
                    }} />
                    <button type="button" className="btn-danger" onClick={() => {
                      updateStage({ inv: st.inv.filter((_, i) => i !== ti) });
                    }}>✕</button>
                  </div>
                  <div className="flex gap-2 mb-3">
                    <NumField label="Design Limit (LBS)" value={item.designLbs} onChange={(v) => {
                      const inv = st.inv.map((x, i) => i === ti ? { ...x, designLbs: v } : x);
                      updateStage({ inv });
                    }} />
                    <NumField label="Actual Load (LBS)" value={item.consumed} onChange={(v) => {
                      const inv = st.inv.map((x, i) => i === ti ? { ...x, consumed: v } : x);
                      updateStage({ inv });
                    }} />
                  </div>
                  <div className="prog-track mb-1">
                    <div className="prog-fill" style={{ width: `${pct}%`, background: item.color }} />
                  </div>
                  <div className="flex justify-between" style={{ fontSize: 10, color: 'var(--text2)', fontWeight: 600 }}>
                    <span>{Math.round(pct)}% consumed</span>
                    <span>{F.c(rem)} LBS remaining</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </ToolCard>

      <ToolCard title="Sand Needed ↔ Clean Volume" tab={TAB}>
        <div className="grid-2 mb-3">
          <NumField label="Clean Volume (BBL)" value={snClean} onChange={setSnClean} className="" />
          <NumField label="Concentration (PPG)" value={snPpg} onChange={setSnPpg} step="0.5" className="" />
        </div>
        <div className="flex gap-3">
          <ResultTile label="Sand Needed" value={F.c(snLbs)} unit="LBS" emphasize />
          <ResultTile label="Clean Vol from Sand" value={snPpg > 0 ? F.c(snLbs / 42 / snPpg) : '0'} unit="BBL" />
        </div>
      </ToolCard>

      <ToolCard title="AVF • CFR • Yield • Slurry Density" tab={TAB}>
        <div className="grid-2 mb-3">
          <NumField label="PPA (PPG)" value={ppa} onChange={setPpa} step="0.5" className="" />
          <NumField label="Sand SG" value={sg} onChange={setSg} step="0.05" className="" />
        </div>
        <div className="grid-2 gap-2">
          <ResultTile label="AVF" value={avfVal.toFixed(4)} className="tile" />
          <ResultTile label="CFR" value={cfr.toFixed(3)} className="tile" />
          <ResultTile label="Yield" value={propYield.toFixed(3)} className="tile" />
          <ResultTile label="Slurry Dens (PPG)" value={slurryDens.toFixed(2)} emphasize className="tile" />
        </div>
      </ToolCard>

      <ToolCard title="Proppant Concentration (PPA) Calculators" tab={TAB}>
        <div className="lbl mb-2">Method 1 — Pump Rates</div>
        <div className="grid-3 mb-3">
          <NumField label="Slurry Rate (BPM)" value={pcSlurry} onChange={setPcSlurry} className="" />
          <NumField label="Clean Rate (BPM)" value={pcClean} onChange={setPcClean} className="" />
          <NumField label="SG of Prop" value={pcSg1} onChange={setPcSg1} step="0.05" className="" />
        </div>
        <ResultTile label="PPA" value={ppa1.toFixed(2)} emphasize className="tile mb-3" />
        <div className="lbl mb-2">Method 2 — Measured Density</div>
        <div className="grid-3 mb-3">
          <NumField label="Carrier Density" value={pcCarrier} onChange={setPcCarrier} step="0.01" className="" />
          <NumField label="Measured Density" value={pcMeasured} onChange={setPcMeasured} step="0.01" className="" />
          <NumField label="SG of Prop" value={pcSg2} onChange={setPcSg2} step="0.05" className="" />
        </div>
        <ResultTile label="PPA" value={ppa2.toFixed(2)} emphasize className="tile" />
      </ToolCard>

      <ToolCard title="Sand Ramp Calculator" tab={TAB}>
        <div className="grid-3 mb-3">
          <NumField label="Start PPA" value={rStart} onChange={setRStart} step="0.1" className="" />
          <NumField label="End PPA" value={rEnd} onChange={setREnd} step="0.1" className="" />
          <NumField label="Clean Volume (BBL)" value={rVol} onChange={setRVol} className="" />
        </div>
        <div className="flex gap-3">
          <ResultTile label="Avg PPA" value={rAvg.toFixed(2)} />
          <ResultTile label="Total Sand" value={F.c(rTotal)} unit="LBS" emphasize />
        </div>
      </ToolCard>

      <ToolCard title="PPR Calculator (Auger Dimensions)" tab={TAB}>
        <div className="grid-2 mb-3">
          <NumField label="Auger Radius (IN)" value={augR} onChange={setAugR} step="0.1" className="" />
          <NumField label="Shaft Radius (IN)" value={shaftR} onChange={setShaftR} step="0.1" className="" />
          <NumField label="Pitch (IN)" value={pitch} onChange={setPitch} step="0.1" className="" />
          <NumField label="Bulk Density (LBS/FT³)" value={bulk} onChange={setBulk} className="" />
        </div>
        <ResultTile label="PPR" value={ppr.toFixed(4)} unit="LBS/REV" emphasize className="tile" />
      </ToolCard>

      <ToolCard title="PPR Recalibration (Post-Stage Adjustment)" tab={TAB}>
        <div className="grid-3 mb-3">
          <NumField label="Old PPR" value={pprOld} onChange={setPprOld} step="0.0001" className="" />
          <NumField label="Actual Total Pumped (LBS)" value={pprActual} onChange={setPprActual} className="" />
          <NumField label="Design Total Pumped (LBS)" value={pprDesign} onChange={setPprDesign} className="" />
        </div>
        <ResultTile label="New PPR" value={pprNew.toFixed(4)} emphasize className="tile" />
      </ToolCard>

      <ToolCard title="Auger RPM, PPM & PPT Rates" tab={TAB}>
        <div className="grid-3 mb-3">
          <NumField label="Clean Rate (BPM)" value={arRate} onChange={setArRate} className="" />
          <NumField label="PPG / PPA" value={arPpg} onChange={setArPpg} step="0.1" className="" />
          <NumField label="PPR (LBS/REV)" value={arPpr} onChange={setArPpr} step="0.0001" className="" />
        </div>
        <div className="grid-3 gap-2">
          <ResultTile label="Total Auger RPM" value={totalRpm.toFixed(1)} emphasize className="tile" />
          <ResultTile label="PPM" value={F.c(ppm)} unit="LBS/MIN" className="tile" />
          <ResultTile label="PPT" value={F.c(arPpg * 1000)} className="tile" />
        </div>
      </ToolCard>

      <ToolCard title="Multi-Auger Priority RPM Allocation" tab={TAB}>
        <div className="grid-3 mb-3">
          <NumField label="Total Prop RPM" value={maTotal} onChange={setMaTotal} className="" />
          <NumField label="# Augers" value={maCount} onChange={(v) => setMaCount(Math.max(1, Math.round(v)))} className="" />
          <NumField label="RPM Threshold / Auger" value={maThresh} onChange={setMaThresh} className="" />
        </div>
        <div className="grid-3 gap-2">
          {augerRpms.map((rpm, i) => (
            <ResultTile key={i} label={`Auger ${i + 1} RPM ${isOver ? '(Equal Run)' : `(P${i + 1})`}`}
              value={rpm.toFixed(1)} unit="RPM" emphasize className="tile" />
          ))}
        </div>
      </ToolCard>

      <ToolCard title="Job Prop Total from Cum Volumes" tab={TAB}
        formula="Job Prop Total (lbs) = (Slurry Cum − Clean Cum − All Chem Totals) / Prop AVF">
        <div className="grid-3 mb-3">
          <NumField label="Slurry Cum (GAL)" value={jpSlurry} onChange={setJpSlurry} className="" />
          <NumField label="Clean Cum (GAL)" value={jpClean} onChange={setJpClean} className="" />
          <NumField label="All Chem Totals (GAL)" value={jpChem} onChange={setJpChem} className="" />
        </div>
        <ResultTile label="Job Prop Total" value={F.c(jpTotal)} unit="LBS" emphasize className="tile" />
        <div style={{ fontSize: 11, color: 'var(--text2)', marginTop: 8 }}>
          Using AVF from SG above: {avfVal.toFixed(4)} gal/lb
        </div>
      </ToolCard>
    </div>
  );
}

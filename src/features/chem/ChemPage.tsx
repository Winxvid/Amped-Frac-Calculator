import { useMemo, useState } from 'react';
import { F } from '../../lib/formulas';
import { useNavigation } from '../../context/NavigationContext';
import { useCalcState } from '../../context/CalcStateContext';
import { SectionHeader } from '../../components/ui/SectionHeader';
import { ToolCard } from '../../components/tools/ToolCard';
import { NumField, ResultTile } from '../../components/ui/NumField';
import { TOTE_TYPES, HCL_TABLE } from '../shared/fieldData';

const TAB = 'chem';

const CH_COLORS = [
  '#10B981',
  '#3B82F6',
  '#EF4444',
  '#F59E0B',
  '#8B5CF6',
  '#EC4899',
  '#6366F1',
  '#06B6D4',
  '#14B8A6',
  '#F97316',
];

type ChemChannel = {
  id: string;
  name: string;
  color: string;
  gpt: number;
  fine: number;
};

type MultiToteRow = {
  id: string;
  strap: number;
  bottoms: number;
  factor: number;
};

function hclDensFromPct(pct: number) {
  return 8.33 * (1 + 0.0051 * pct);
}

function hclPctFromDens(dens: number) {
  if (dens <= 0) return 0;
  return ((dens / 8.33) - 1) / 0.0051;
}

export function ChemPage() {
  const { tab } = useNavigation();
  const active = tab === 'chem';
  const { cleanRate, setCleanRate } = useCalcState();

  // Batch config
  const [channelCount, setChannelCount] = useState(2);
  const [channels, setChannels] = useState<ChemChannel[]>(() =>
    Array.from({ length: 2 }, (_, i) => ({
      id: `c0_${i}`,
      name: `CHANNEL_${i + 1}`,
      color: CH_COLORS[i % CH_COLORS.length],
      gpt: 1,
      fine: 1,
    })),
  );

  // Chemical used from straps
  const [cuStart, setCuStart] = useState(0);
  const [cuEnd, setCuEnd] = useState(0);

  // Stage variance
  const [cvPumped, setCvPumped] = useState(0);
  const [cvDesigned, setCvDesigned] = useState(0);

  // GPT ↔ GPM
  const [ggRate, setGgRate] = useState(0);
  const [ggGpt, setGgGpt] = useState(0);

  // HCL density / %
  const [hclPct, setHclPct] = useState(15);
  const [hclDens, setHclDens] = useState(() =>
    Number(hclDensFromPct(15).toFixed(3)),
  );

  // Acid dilution
  const [adVol, setAdVol] = useState(20);
  const [adRawPct, setAdRawPct] = useState(50);
  const [adTgtPct, setAdTgtPct] = useState(15);
  const [adDens, setAdDens] = useState(9.52);

  // Buffer
  const [bufBbl, setBufBbl] = useState(0);
  const [bufGpt, setBufGpt] = useState(0);

  // Tote volume
  const [toteStrap, setToteStrap] = useState(48);
  const [toteFactor, setToteFactor] = useState(TOTE_TYPES[0].factor);
  const [toteBottoms, setToteBottoms] = useState(0);

  // Multi-tote
  const [multiTotes, setMultiTotes] = useState<MultiToteRow[]>([]);

  // Ending strap
  const [esClean, setEsClean] = useState(0);
  const [esGpt, setEsGpt] = useState(0);
  const [esStart, setEsStart] = useState(0);
  const [esFactor, setEsFactor] = useState(TOTE_TYPES[0].factor);

  // Tote refill
  const [trClean, setTrClean] = useState(50000);
  const [trGpt, setTrGpt] = useState(1.5);
  const [trFill, setTrFill] = useState(44);
  const [trBot, setTrBot] = useState(2);
  const [trFac, setTrFac] = useState(7.45);

  // Chem setpoint back-calc
  const [ccGpm, setCcGpm] = useState(12);
  const [ccBpm, setCcBpm] = useState(60);
  const [ccTotChem, setCcTotChem] = useState(1500);
  const [ccTargetGpt, setCcTargetGpt] = useState(2);

  // GPT ↔ PPT
  const [gpGpt, setGpGpt] = useState(1.5);
  const [gpDens, setGpDens] = useState(9.2);
  const [gpActive, setGpActive] = useState(100);
  const [gpInPpt, setGpInPpt] = useState(20);

  // Strap rate
  const [srInHr, setSrInHr] = useState(24);
  const [srFactor, setSrFactor] = useState(7.45);
  const [srCleanBpm, setSrCleanBpm] = useState(65);

  // Chem SG
  const [csgSg, setCsgSg] = useState(1.1);
  const [csgVol, setCsgVol] = useState(330);
  const [csgWaterPpg, setCsgWaterPpg] = useState(8.34);

  // —— Calculations ——
  const totalGpm = useMemo(
    () =>
      channels.reduce(
        (s, ch) => s + F.gpm(cleanRate, ch.gpt, ch.fine),
        0,
      ),
    [channels, cleanRate],
  );

  const chemUsed = Math.max(0, cuStart - cuEnd);

  const cvPct = cvDesigned > 0 ? (cvPumped / cvDesigned) * 100 : 0;
  const cvDiff = cvPumped - cvDesigned;
  const cvStatus =
    cvDiff > 0
      ? `Over by ${cvDiff.toFixed(1)} gal`
      : cvDiff < 0
        ? `Under by ${Math.abs(cvDiff).toFixed(1)} gal`
        : 'Exact match';
  const cvStatusColor =
    cvDiff > 0 ? 'var(--yellow)' : cvDiff < 0 ? 'var(--brand)' : 'var(--blue)';

  const ggGpm = F.gpm(ggRate, ggGpt);

  const adDilute =
    adVol * ((adDens / 8.34) * (adRawPct - adTgtPct) + 1);
  const adWater = Math.max(0, adDilute - adVol);

  const bufferGal = bufBbl * 0.042 * bufGpt;

  const toteAccessible = Math.max(0, (toteStrap - toteBottoms) * toteFactor);
  const toteTotal = toteStrap * toteFactor;

  const multiTotal = multiTotes.reduce(
    (s, r) => s + Math.max(0, (r.strap || 0) - (r.bottoms || 0)) * (r.factor || 0),
    0,
  );

  const esFrNeeded = esClean * 0.042 * esGpt;
  const esEndStrap =
    esFactor > 0
      ? Math.max(0, esStart * esFactor - esFrNeeded) / esFactor
      : 0;

  const trNeeded = trClean * 0.042 * trGpt;
  const trAccess = Math.max(0, trFill - trBot) * trFac;
  const trCount = trAccess > 0 ? Math.ceil(trNeeded / trAccess) : 0;

  const ccOutGpt = ccBpm > 0 ? ccGpm / ccBpm : 0;
  const ccOutCleanBbl =
    ccTargetGpt > 0 ? ccTotChem / (ccTargetGpt * 0.042) : 0;

  const gpOutPpt = gpGpt * gpDens * (gpActive / 100);
  const gpActiveDens = gpDens * (gpActive / 100);
  const gpOutBackGpt = gpActiveDens > 0 ? gpInPpt / gpActiveDens : 0;

  const srOutGpm = (srInHr * srFactor) / 60;
  const srOutGpt = srCleanBpm > 0 ? srOutGpm / srCleanBpm : 0;

  const csgOutPpg = csgSg * csgWaterPpg;
  const csgOutLbs = csgVol * csgOutPpg;

  // —— Channel helpers ——
  const initChannels = () => {
    const n = Math.max(1, Math.min(10, Math.round(channelCount) || 2));
    setChannelCount(n);
    setChannels(
      Array.from({ length: n }, (_, i) => ({
        id: `c${Date.now()}_${i}`,
        name: `CHANNEL_${i + 1}`,
        color: CH_COLORS[i % CH_COLORS.length],
        gpt: 1,
        fine: 1,
      })),
    );
  };

  const updateChannel = (id: string, patch: Partial<ChemChannel>) => {
    setChannels((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...patch } : c)),
    );
  };

  const delChannel = (id: string) => {
    setChannels((prev) => prev.filter((c) => c.id !== id));
  };

  const addMultiTote = () => {
    setMultiTotes((prev) => [
      ...prev,
      {
        id: `mt${Date.now()}`,
        strap: 48,
        bottoms: 0,
        factor: TOTE_TYPES[0].factor,
      },
    ]);
  };

  const updateMultiTote = (id: string, patch: Partial<MultiToteRow>) => {
    setMultiTotes((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ...patch } : r)),
    );
  };

  const delMultiTote = (id: string) => {
    setMultiTotes((prev) => prev.filter((r) => r.id !== id));
  };

  const onHclPct = (v: number) => {
    setHclPct(v);
    setHclDens(Number(hclDensFromPct(v).toFixed(3)));
  };

  const onHclDens = (v: number) => {
    setHclDens(v);
    setHclPct(Number(hclPctFromDens(v).toFixed(1)));
  };

  return (
    <div className={`section${active ? ' active' : ''}`} id="s-chem">
      <SectionHeader
        tab={TAB}
        title="CHEMICAL CALCULATIONS"
        subtitle="CHEMICAL FUNDAMENTALS"
      />

      {/* Total GPM summary */}
      <div className="brand-card mb-4 text-center">
        <div
          className="lbl"
          style={{ color: 'rgba(255,255,255,0.6)', display: 'block' }}
        >
          Total Injection Synthesis
        </div>
        <div
          className="font-display"
          style={{ fontSize: 52, fontWeight: 900, color: '#fff' }}
        >
          {totalGpm.toFixed(2)}
        </div>
        <div
          style={{
            fontSize: 11,
            color: 'rgba(255,255,255,0.5)',
            marginTop: 4,
          }}
        >
          Dynamic summation of {channels.length} active channel
          {channels.length === 1 ? '' : 's'}
        </div>
        <div
          style={{
            fontSize: 10,
            fontWeight: 800,
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.3)',
            letterSpacing: 2,
            marginTop: 4,
          }}
        >
          GPM_REQ
        </div>
      </div>

      {/* Batch Config */}
      <ToolCard title="Batch Config" tab={TAB}>
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
              — shared with HP &amp; Hydration
            </span>
          </label>
          <input
            type="number"
            className="field"
            value={cleanRate}
            step="0.1"
            placeholder="0"
            onChange={(e) =>
              setCleanRate(parseFloat(e.target.value) || 0)
            }
          />
        </div>
        <div className="flex gap-3 items-end">
          <div className="flex-1">
            <label className="lbl">Active Channels (1–10)</label>
            <input
              type="number"
              className="field"
              value={channelCount}
              min={1}
              max={10}
              onChange={(e) =>
                setChannelCount(
                  Math.max(1, Math.min(10, parseInt(e.target.value, 10) || 1)),
                )
              }
            />
          </div>
          <button
            type="button"
            className="btn btn-brand"
            style={{ whiteSpace: 'nowrap' }}
            onClick={initChannels}
          >
            Init
          </button>
        </div>
      </ToolCard>

      {/* Channel cards */}
      <div className="grid-2 mb-4">
        {channels.length === 0 ? (
          <div
            style={{
              gridColumn: '1 / -1',
              textAlign: 'center',
              color: 'var(--text2)',
              padding: 20,
              fontSize: 13,
            }}
          >
            No channels. Click Init to create channels.
          </div>
        ) : (
          channels.map((ch) => {
            const gpm = F.gpm(cleanRate, ch.gpt, ch.fine);
            return (
              <div key={ch.id} className="card-sm">
                <div className="flex items-center gap-2 mb-3">
                  <input
                    type="color"
                    value={ch.color}
                    onChange={(e) =>
                      updateChannel(ch.id, { color: e.target.value })
                    }
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: '50%',
                      border: 'none',
                      padding: 0,
                    }}
                    aria-label={`${ch.name} color`}
                  />
                  <input
                    type="text"
                    value={ch.name}
                    onChange={(e) =>
                      updateChannel(ch.id, { name: e.target.value })
                    }
                    style={{
                      background: 'transparent',
                      border: 'none',
                      outline: 'none',
                      fontSize: 11,
                      fontWeight: 800,
                      textTransform: 'uppercase',
                      color: 'var(--text)',
                      flex: 1,
                      fontFamily: 'inherit',
                    }}
                    aria-label="Channel name"
                  />
                  <button
                    type="button"
                    className="btn-danger"
                    style={{ padding: '2px 6px' }}
                    onClick={() => delChannel(ch.id)}
                  >
                    ✕
                  </button>
                </div>
                <div className="mb-2">
                  <NumField
                    label="GPT"
                    value={ch.gpt}
                    onChange={(v) => updateChannel(ch.id, { gpt: v })}
                    step="0.01"
                    className=""
                  />
                </div>
                <div className="mb-3">
                  <NumField
                    label="Fine Adjust"
                    value={ch.fine}
                    onChange={(v) => updateChannel(ch.id, { fine: v || 1 })}
                    step="0.001"
                    className=""
                  />
                </div>
                <div
                  style={{
                    background: 'rgba(16,185,129,0.08)',
                    border: '1px solid rgba(16,185,129,0.2)',
                    borderRadius: 10,
                    padding: 10,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <div className="lbl" style={{ marginBottom: 2 }}>
                      GPM Output
                    </div>
                    <div
                      className="font-display"
                      style={{
                        fontSize: 18,
                        fontWeight: 900,
                        color: 'var(--brand)',
                      }}
                    >
                      {gpm.toFixed(3)}
                    </div>
                  </div>
                  <div
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      color: 'var(--text2)',
                    }}
                  >
                    GPM
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Chemical Used from Straps */}
      <ToolCard title="Chemical Used from Straps" tab={TAB}>
        <div className="flex gap-3 mb-3">
          <NumField
            label="Starting Strap (GAL or IN)"
            value={cuStart}
            onChange={setCuStart}
          />
          <NumField
            label="Ending / Current Strap"
            value={cuEnd}
            onChange={setCuEnd}
          />
        </div>
        <ResultTile
          label="Chemical Used"
          value={chemUsed.toFixed(1)}
          emphasize
          className="tile"
        />
      </ToolCard>

      {/* Stage Variance */}
      <ToolCard title="Chemical Stage Variance" tab={TAB}>
        <div className="flex gap-3 mb-3">
          <NumField
            label="Amount Pumped (GAL)"
            value={cvPumped}
            onChange={setCvPumped}
          />
          <NumField
            label="Designed (GAL)"
            value={cvDesigned}
            onChange={setCvDesigned}
          />
        </div>
        <div className="flex gap-3">
          <ResultTile
            label="Variance"
            value={`${cvPct.toFixed(1)}%`}
            emphasize
          />
          <div className="tile flex-1">
            <div className="lbl">Status</div>
            <div className="val" style={{ fontSize: 14, color: cvStatusColor }}>
              {cvStatus}
            </div>
          </div>
        </div>
      </ToolCard>

      {/* GPT ↔ GPM */}
      <ToolCard title="GPT ↔ GPM Converter" tab={TAB}
        formula="GPM = Clean Rate (bpm) × 0.042 × GPT">
        <div className="flex gap-3 mb-3">
          <NumField
            label="Clean Rate (BPM)"
            value={ggRate}
            onChange={setGgRate}
            step="0.1"
          />
          <NumField
            label="Setpoint (GPT)"
            value={ggGpt}
            onChange={setGgGpt}
            step="0.05"
          />
        </div>
        <div className="flex gap-3">
          <ResultTile
            label="Chemical Rate"
            value={ggGpm.toFixed(2)}
            unit="GPM"
            emphasize
          />
          <ResultTile
            label="Concentration"
            value={ggGpt.toFixed(2)}
            unit="GPT"
          />
        </div>
      </ToolCard>

      {/* HCL Density & % */}
      <ToolCard
        title="HCL Density & % Converter"
        tab={TAB}
        formula="Density = 8.33 × (1 + 0.0051 × % HCL)"
      >
        <div className="flex gap-3 mb-3">
          <NumField
            label="% HCL"
            value={hclPct}
            onChange={onHclPct}
            step="0.5"
          />
          <NumField
            label="Density (PPG)"
            value={hclDens}
            onChange={onHclDens}
            step="0.001"
          />
        </div>
        <div style={{ fontSize: 11, color: 'var(--text2)' }}>
          Edit either field — the other updates automatically.
        </div>
      </ToolCard>

      {/* Acid Dilution */}
      <ToolCard
        title="Acid Dilution (HCL)"
        tab={TAB}
        formula="Dilute Vol = Raw Vol × ((Dens / 8.34) × (Raw% − Target%) + 1)"
      >
        <div className="grid-2 mb-3">
          <NumField
            label="Raw Volume (GAL)"
            value={adVol}
            onChange={setAdVol}
            className=""
          />
          <NumField
            label="Raw % HCL"
            value={adRawPct}
            onChange={setAdRawPct}
            step="1"
            className=""
          />
          <NumField
            label="Target Dilute %"
            value={adTgtPct}
            onChange={setAdTgtPct}
            step="1"
            className=""
          />
          <NumField
            label="Raw Density (PPG)"
            value={adDens}
            onChange={setAdDens}
            step="0.01"
            className=""
          />
        </div>
        <div className="flex gap-3">
          <ResultTile
            label="Dilute Volume"
            value={adDilute.toFixed(1)}
            unit="GAL"
          />
          <ResultTile
            label="Water to Add"
            value={adWater.toFixed(1)}
            unit="GAL"
            emphasize
          />
        </div>
      </ToolCard>

      {/* Buffer Needed */}
      <ToolCard
        title="Buffer Needed"
        tab={TAB}
        formula="Buffer (gal) = Clean Vol (bbl) × 0.042 × GPT"
      >
        <div className="flex gap-3 mb-3">
          <NumField
            label="Clean Volume (BBL)"
            value={bufBbl}
            onChange={setBufBbl}
          />
          <NumField
            label="Setpoint (GPT)"
            value={bufGpt}
            onChange={setBufGpt}
            step="0.05"
          />
        </div>
        <ResultTile
          label="Buffer Required"
          value={bufferGal.toFixed(2)}
          unit="GAL"
          emphasize
          className="tile"
        />
      </ToolCard>

      {/* Tote Volume from Strap */}
      <ToolCard title="Tote Volume from Strap" tab={TAB}>
        <div className="mb-3">
          <NumField
            label="Current Strap (IN)"
            value={toteStrap}
            onChange={setToteStrap}
            step="0.1"
            className=""
          />
        </div>
        <div className="flex gap-3 items-end mb-3">
          <div className="flex-1">
            <label className="lbl">Tote Type</label>
            <select
              className="field"
              value={toteFactor}
              onChange={(e) => setToteFactor(parseFloat(e.target.value))}
            >
              {TOTE_TYPES.map((t) => (
                <option key={t.label} value={t.factor}>
                  {t.label} ({t.factor})
                </option>
              ))}
            </select>
          </div>
          <NumField
            label="Bottoms (IN)"
            value={toteBottoms}
            onChange={setToteBottoms}
            step="0.5"
          />
        </div>
        <div className="flex gap-3">
          <ResultTile
            label="Accessible"
            value={toteAccessible.toFixed(1)}
            unit="GAL"
            emphasize
          />
          <ResultTile
            label="Total"
            value={toteTotal.toFixed(1)}
            unit="GAL"
          />
        </div>
      </ToolCard>

      {/* Multi-Tote */}
      <ToolCard
        title="Multi-Tote Accessible Volume"
        tab={TAB}
        badge={
          <button
            type="button"
            className="btn btn-brand"
            style={{ fontSize: 12, padding: '7px 14px' }}
            onClick={addMultiTote}
          >
            + Add Tote
          </button>
        }
      >
        {multiTotes.length === 0 ? (
          <div
            style={{
              color: 'var(--text2)',
              textAlign: 'center',
              padding: 14,
              fontSize: 13,
            }}
          >
            No totes yet.
          </div>
        ) : (
          multiTotes.map((row) => (
            <div key={row.id} className="card-sm mb-3">
              <div className="flex gap-2 mb-2 items-end">
                <NumField
                  label="Strap (IN)"
                  value={row.strap}
                  onChange={(v) => updateMultiTote(row.id, { strap: v })}
                  step="0.1"
                />
                <button
                  type="button"
                  className="btn-danger"
                  onClick={() => delMultiTote(row.id)}
                >
                  ✕
                </button>
              </div>
              <div className="flex gap-2 items-end">
                <div className="flex-1">
                  <label className="lbl">Tote Type</label>
                  <select
                    className="field"
                    value={row.factor}
                    onChange={(e) =>
                      updateMultiTote(row.id, {
                        factor: parseFloat(e.target.value),
                      })
                    }
                  >
                    {TOTE_TYPES.map((t) => (
                      <option key={t.label} value={t.factor}>
                        {t.label} ({t.factor})
                      </option>
                    ))}
                  </select>
                </div>
                <div style={{ width: 90 }}>
                  <NumField
                    label="Bottoms (IN)"
                    value={row.bottoms}
                    onChange={(v) => updateMultiTote(row.id, { bottoms: v })}
                    step="0.5"
                    className=""
                  />
                </div>
              </div>
            </div>
          ))
        )}
        <ResultTile
          label="Total Pumpable"
          value={multiTotal.toFixed(1)}
          unit="GAL"
          emphasize
          className="tile mt-3"
        />
      </ToolCard>

      {/* Ending Strap Predictor */}
      <ToolCard
        title="Ending Strap Predictor"
        tab={TAB}
        formula="FR Needed = Clean × 0.042 × GPT · End Strap = (Start × Fac − FR) / Fac"
      >
        <div className="grid-2 mb-3">
          <NumField
            label="Clean Volume (BBL)"
            value={esClean}
            onChange={setEsClean}
            className=""
          />
          <NumField
            label="GPT Setpoint"
            value={esGpt}
            onChange={setEsGpt}
            step="0.1"
            className=""
          />
          <NumField
            label="Start Strap (IN)"
            value={esStart}
            onChange={setEsStart}
            step="0.1"
            className=""
          />
          <div>
            <label className="lbl">Tote Type</label>
            <select
              className="field"
              value={esFactor}
              onChange={(e) => setEsFactor(parseFloat(e.target.value))}
            >
              {TOTE_TYPES.map((t) => (
                <option key={t.label} value={t.factor}>
                  {t.label} ({t.factor})
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex gap-3">
          <ResultTile
            label="FR Needed"
            value={F.c(esFrNeeded)}
            unit="GAL"
          />
          <ResultTile
            label="Ending Strap"
            value={esEndStrap.toFixed(1)}
            unit="IN"
            emphasize
          />
        </div>
      </ToolCard>

      {/* Tote Refill Count */}
      <ToolCard title="Tote Refill Count Calculator" tab={TAB}>
        <div className="grid-2 mb-3">
          <NumField
            label="Stage Clean Vol (BBL)"
            value={trClean}
            onChange={setTrClean}
            className=""
          />
          <NumField
            label="Setpoint (GPT)"
            value={trGpt}
            onChange={setTrGpt}
            step="0.1"
            className=""
          />
          <NumField
            label="Fill Height (IN)"
            value={trFill}
            onChange={setTrFill}
            step="0.5"
            className=""
          />
          <NumField
            label="Bottoms (IN)"
            value={trBot}
            onChange={setTrBot}
            step="0.5"
            className=""
          />
        </div>
        <div className="mb-3">
          <NumField
            label="Tote Capacity Factor (GAL/IN)"
            value={trFac}
            onChange={setTrFac}
            step="0.01"
            className=""
          />
        </div>
        <div className="grid-3 gap-2">
          <ResultTile
            label="Chem Needed"
            value={F.c(trNeeded)}
            unit="GAL"
            className="tile"
          />
          <ResultTile
            label="Accessible / Tote"
            value={trAccess.toFixed(1)}
            unit="GAL"
            className="tile"
          />
          <ResultTile
            label="Tote Refills Needed"
            value={trCount}
            unit="TIMES"
            emphasize
            className="tile"
          />
        </div>
      </ToolCard>

      {/* Chem Setpoint Back-Calc */}
      <ToolCard
        title="Chemical Setpoint & Clean Volume Back-Calculator"
        tab={TAB}
        formula="GPT = GPM / BPM · Clean BBL = Total Chem / (GPT × 0.042)"
      >
        <div className="grid-2 mb-3">
          <NumField
            label="Chemical Rate (GPM)"
            value={ccGpm}
            onChange={setCcGpm}
            step="0.1"
            className=""
          />
          <NumField
            label="Clean Rate (BPM)"
            value={ccBpm}
            onChange={setCcBpm}
            step="0.1"
            className=""
          />
          <NumField
            label="Total Chem Used (GAL)"
            value={ccTotChem}
            onChange={setCcTotChem}
            className=""
          />
          <NumField
            label="Target Setpoint (GPT)"
            value={ccTargetGpt}
            onChange={setCcTargetGpt}
            step="0.1"
            className=""
          />
        </div>
        <div className="flex gap-3">
          <ResultTile
            label="Calculated Setpoint"
            value={ccOutGpt.toFixed(2)}
            unit="GPT"
            emphasize
          />
          <ResultTile
            label="Clean Fluid Treated"
            value={F.c(ccOutCleanBbl)}
            unit="BBL"
            emphasize
          />
        </div>
      </ToolCard>

      {/* GPT ↔ PPT */}
      <ToolCard
        title="Liquid vs Dry Concentration Converter (GPT ↔ PPT)"
        tab={TAB}
        formula="PPT = GPT × Density × (Active% / 100)"
      >
        <div className="grid-3 mb-3">
          <NumField
            label="Liquid Setpoint (GPT)"
            value={gpGpt}
            onChange={setGpGpt}
            step="0.1"
            className=""
          />
          <NumField
            label="Chemical Density (PPG)"
            value={gpDens}
            onChange={setGpDens}
            step="0.1"
            className=""
          />
          <NumField
            label="Active Chemical (%)"
            value={gpActive}
            onChange={setGpActive}
            step="1"
            className=""
          />
        </div>
        <ResultTile
          label="Calculated Dry Concentration"
          value={gpOutPpt.toFixed(1)}
          unit="PPT (LBS/1000 GAL)"
          emphasize
          className="tile mb-3"
        />
        <div
          style={{
            background: 'var(--surface)',
            padding: 12,
            borderRadius: 10,
          }}
        >
          <div className="lbl mb-2">
            Back-Calculate GPT from PPT (LBS/1000 GAL)
          </div>
          <div className="flex gap-3 items-end">
            <NumField
              label="Dry Loading (PPT)"
              value={gpInPpt}
              onChange={setGpInPpt}
              step="0.5"
            />
            <ResultTile
              label="Equivalent Setpoint"
              value={gpOutBackGpt.toFixed(2)}
              unit="GPT"
              emphasize
            />
          </div>
        </div>
      </ToolCard>

      {/* Strap Rate */}
      <ToolCard
        title="Strap Rate (IN/HR) & Chemical Flow Rate"
        tab={TAB}
        formula="GPM = (IN/HR × Factor) / 60 · GPT = GPM / Clean BPM"
      >
        <div className="grid-3 mb-3">
          <NumField
            label="Strap Rate (IN/HR)"
            value={srInHr}
            onChange={setSrInHr}
            step="0.5"
            className=""
          />
          <NumField
            label="Tote Factor (GAL/IN)"
            value={srFactor}
            onChange={setSrFactor}
            step="0.01"
            className=""
          />
          <NumField
            label="Clean Rate (BPM)"
            value={srCleanBpm}
            onChange={setSrCleanBpm}
            step="0.1"
            className=""
          />
        </div>
        <div className="flex gap-3">
          <ResultTile
            label="Chemical Flow Rate"
            value={srOutGpm.toFixed(2)}
            unit="GPM"
            emphasize
          />
          <ResultTile
            label="Achieved Setpoint"
            value={srOutGpt.toFixed(3)}
            unit="GPT"
            emphasize
          />
        </div>
      </ToolCard>

      {/* Chem SG */}
      <ToolCard
        title="Chemical Specific Gravity (SG) & Tote Weight"
        tab={TAB}
        formula="PPG = SG × Water PPG · Weight (lbs) = Volume × PPG"
      >
        <div className="grid-3 mb-3">
          <NumField
            label="Specific Gravity (SG)"
            value={csgSg}
            onChange={setCsgSg}
            step="0.01"
            className=""
          />
          <NumField
            label="Volume (GAL)"
            value={csgVol}
            onChange={setCsgVol}
            className=""
          />
          <NumField
            label="Water Density (PPG)"
            value={csgWaterPpg}
            onChange={setCsgWaterPpg}
            step="0.01"
            className=""
          />
        </div>
        <div className="flex gap-3">
          <ResultTile
            label="Chemical Density"
            value={csgOutPpg.toFixed(2)}
            unit="PPG (LBS/GAL)"
            emphasize
          />
          <ResultTile
            label="Total Mass / Weight"
            value={F.c(csgOutLbs)}
            unit="LBS"
            emphasize
          />
        </div>
      </ToolCard>

      {/* Tote Capacity Factors table */}
      <ToolCard title="Tote Capacity Factors" tab={TAB}>
        <div className="tbl-wrap">
          <table className="tbl">
            <thead>
              <tr>
                <th style={{ textAlign: 'left' }}>Tote Type</th>
                <th className="tbl-right">GAL/IN</th>
              </tr>
            </thead>
            <tbody>
              {TOTE_TYPES.map((t) => (
                <tr key={t.label}>
                  <td style={{ fontWeight: 600 }}>{t.label}</td>
                  <td
                    className="tbl-right"
                    style={{
                      fontWeight: 900,
                      color: 'var(--brand)',
                      fontFamily: 'monospace',
                    }}
                  >
                    {t.factor.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ToolCard>

      {/* HCL by mass density table */}
      <ToolCard title="% HCL by Mass Density" tab={TAB}>
        <div className="tbl-wrap">
          <table className="tbl">
            <thead>
              <tr>
                <th style={{ textAlign: 'left' }}>% HCL</th>
                <th className="tbl-right">Density (PPG)</th>
              </tr>
            </thead>
            <tbody>
              {HCL_TABLE.map(([pct, dens]) => (
                <tr key={pct}>
                  <td style={{ fontWeight: 600 }}>{pct}%</td>
                  <td
                    className="tbl-right"
                    style={{
                      fontWeight: 900,
                      color: 'var(--brand)',
                      fontFamily: 'monospace',
                    }}
                  >
                    {dens.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ToolCard>
    </div>
  );
}

import { useState } from 'react';
import { useNavigation } from '../../context/NavigationContext';
import { ToolCard } from '../../components/tools/ToolCard';
import { NumField, ResultTile } from '../../components/ui/NumField';
import { RULES_OF_FOUR } from '../shared/fieldData';

const TAB = 'hydration';

export function HydrationPage() {
  const { tab } = useNavigation();
  const active = tab === 'hydration';

  // Rules of Four converter
  const [rofLga, setRofLga] = useState(6);
  const [rofPpt, setRofPpt] = useState(24);
  const [rofLbSystem, setRofLbSystem] = useState(24);
  const [rofVisc, setRofVisc] = useState(20);
  const [rofGuarLbs, setRofGuarLbs] = useState(100);
  const [rofLgaUsed, setRofLgaUsed] = useState(25);

  // LGA rate
  const [lgaRate, setLgaRate] = useState(80);
  const [lgaGpt, setLgaGpt] = useState(6);

  // Guar auger
  const [guarRate, setGuarRate] = useState(35);
  const [guarPpt, setGuarPpt] = useState(24);
  const [guarPpr, setGuarPpr] = useState(3);

  // Tub volume
  const [tubCap, setTubCap] = useState(100);
  const [tubLevel, setTubLevel] = useState(50);
  const [tubCleanRate, setTubCleanRate] = useState(80);

  // LGA needed
  const [needVol, setNeedVol] = useState(50);
  const [needGpt, setNeedGpt] = useState(6);

  // Visc up
  const [vuVol, setVuVol] = useState(50);
  const [vuPpt, setVuPpt] = useState(24);

  // Increase visc
  const [tvVol, setTvVol] = useState(80);
  const [tvCurrent, setTvCurrent] = useState(12);
  const [tvTarget, setTvTarget] = useState(18);

  // Design gel
  const [dgBbl, setDgBbl] = useState(650);
  const [dgPpt, setDgPpt] = useState(20);

  // LGA tote
  const [lgaStrap, setLgaStrap] = useState(18);
  const [lgaCap, setLgaCap] = useState(12.33);

  // End LGA tote
  const [endStrap, setEndStrap] = useState(40);
  const [endCap, setEndCap] = useState(12.33);
  const [endNeed, setEndNeed] = useState(50);
  const [endStartVolManual, setEndStartVolManual] = useState<string>('');

  // Mid-stage tote swap
  const [ts1Start, setTs1Start] = useState(10);
  const [ts1Swap, setTs1Swap] = useState(3.5);
  const [ts2Start, setTs2Start] = useState(58);
  const [tsTotal, setTsTotal] = useState(200);
  const [tsFac, setTsFac] = useState(12.33);

  // —— Rules of Four bidirectional ——
  const rofFromLga = (v: number) => {
    setRofLga(v);
    const ppt = v * 4;
    setRofPpt(ppt);
    setRofLbSystem(ppt);
    setRofVisc(Math.max(0, ppt - 4));
  };
  const rofFromPpt = (v: number) => {
    setRofPpt(v);
    setRofLga(v / 4);
    setRofLbSystem(v);
    setRofVisc(Math.max(0, v - 4));
  };
  const rofFromLbSystem = (v: number) => {
    setRofLbSystem(v);
    setRofVisc(Math.max(0, v - 4));
    setRofPpt(v);
    setRofLga(v / 4);
  };
  const rofFromVisc = (v: number) => {
    setRofVisc(v);
    const lbs = v + 4;
    setRofLbSystem(lbs);
    setRofPpt(lbs);
    setRofLga(lbs / 4);
  };
  const rofFromGuarLbs = (v: number) => {
    setRofGuarLbs(v);
    setRofLgaUsed(v / 4);
  };
  const rofFromLgaUsed = (v: number) => {
    setRofLgaUsed(v);
    setRofGuarLbs(v * 4);
  };

  const rofPptOut = rofLga * 4;
  const rofViscOut = Math.max(0, rofPptOut - 4);

  // LGA rate
  const lgaGpm = lgaRate * 0.042 * lgaGpt;
  const lgaPptEq = lgaGpt * 4;
  const lgaPpmEq = lgaRate * 0.042 * lgaPptEq;

  // Guar auger
  const guarPpm = guarRate * 0.042 * guarPpt;
  const guarGpm = guarPpm / 4;
  const guarRpm = guarPpr > 0 ? guarPpm / guarPpr : 0;

  // Tub volume
  const tubVol = tubCap * (tubLevel / 100);
  const tubTime = tubCleanRate > 0 ? tubVol / tubCleanRate : null;

  // LGA needed
  const needGal = needVol * 0.042 * needGpt;
  const needLbs = needGal * 4;

  // Visc up
  const vuLbs = vuVol * 0.042 * vuPpt;
  const vuLga = vuLbs / 4;

  // Increase visc
  const tvDryLbs = tvVol * 0.042 * (tvTarget - tvCurrent);
  const tvLga = tvDryLbs / 4;

  // Design gel
  const dgLbs = dgBbl * 0.042 * dgPpt;
  const dgLga = dgLbs / 4;

  // LGA tote
  const lgaToteGal = lgaStrap * lgaCap;

  // End LGA tote
  const endStartVolParsed = parseFloat(endStartVolManual);
  const endStartVol =
    endStartVolManual !== '' &&
    endStartVolManual != null &&
    !Number.isNaN(endStartVolParsed)
      ? endStartVolParsed
      : endStrap * endCap;
  const endVol = endStartVol - endNeed;
  const endStrapOut = endCap > 0 ? endVol / endCap : 0;

  // Mid-stage swap
  const ts1Gel = Math.max(0, ts1Start - ts1Swap) * tsFac;
  const ts2Gel = Math.max(0, tsTotal - ts1Gel);
  const ts2End =
    tsFac > 0 ? Math.max(0, ts2Start - ts2Gel / tsFac) : 0;

  return (
    <div className={`section${active ? ' active' : ''}`} id="s-hydration">
      <div className="mb-4">
        <div className="sec-title">HYDRATION CALCULATIONS</div>
        <div className="sec-sub">
          Section 4 formulas — Rules of Four, LGA, tub volume, hydration time
          &amp; gel loading
        </div>
      </div>

      {/* Rules of Four reference grid */}
      <ToolCard
        title="Rules of Four Reference"
        tab={TAB}
        badge={
          <span style={{ color: 'var(--blue)', fontSize: 15 }}>ℹ</span>
        }
      >
        <div
          style={{
            fontSize: 11,
            color: 'var(--text2)',
            marginBottom: 12,
            fontWeight: 500,
          }}
        >
          Every LGA gallon has 4 lbs of guar. Viscosity rules of thumb only —
          other factors affect viscosity. Dry guar bulk density ~34–48 lbs/ft³.
        </div>
        <div className="grid-2 gap-2">
          {RULES_OF_FOUR.map(([left, right]) => (
            <div key={left} className="surface-card">
              <div style={{ fontSize: 12, fontWeight: 700 }}>{left}</div>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 800,
                  color: 'var(--brand)',
                  marginTop: 2,
                }}
              >
                {right}
              </div>
            </div>
          ))}
        </div>
      </ToolCard>

      {/* Rules of Four Converter */}
      <ToolCard
        title="Rules of Four Converter"
        tab={TAB}
        formula="LGA = PPT ÷ 4 · PPT = LGA × 4 · Lb System ≈ Target Visc + 4 · LGA Used = Guar lbs ÷ 4"
      >
        <div className="grid-2 mb-3">
          <NumField
            label="LGA Set Point (GPT)"
            value={rofLga}
            onChange={rofFromLga}
            step="0.1"
            className=""
          />
          <NumField
            label="PPT / Gel Loading (LB)"
            value={rofPpt}
            onChange={rofFromPpt}
            step="0.1"
            className=""
          />
          <NumField
            label="Lb System"
            value={rofLbSystem}
            onChange={rofFromLbSystem}
            step="0.1"
            className=""
          />
          <NumField
            label="Target Viscosity (CP)"
            value={rofVisc}
            onChange={rofFromVisc}
            step="0.1"
            className=""
          />
          <NumField
            label="Pounds of Guar Used (LBS)"
            value={rofGuarLbs}
            onChange={rofFromGuarLbs}
            step="0.1"
            className=""
          />
          <NumField
            label="LGA Used (GAL)"
            value={rofLgaUsed}
            onChange={rofFromLgaUsed}
            step="0.1"
            className=""
          />
        </div>
        <div className="flex gap-3">
          <ResultTile
            label="PPT from LGA"
            value={rofPptOut.toFixed(1)}
            unit="LBS / 1000 GAL"
            emphasize
          />
          <ResultTile
            label="Target Visc ≈ Lb − 4"
            value={rofViscOut.toFixed(1)}
            unit="CP"
          />
        </div>
      </ToolCard>

      {/* LGA Rate */}
      <ToolCard
        title="Liquid Gel Automation (LGA) Rate"
        tab={TAB}
        formula="GPM = Rate (bpm) × 0.042 × LGA Set Point (gpt)"
      >
        <div className="flex gap-3 mb-3">
          <NumField
            label="Hydration / Clean Rate (BPM)"
            value={lgaRate}
            onChange={setLgaRate}
            step="0.1"
          />
          <NumField
            label="LGA Set Point (GPT)"
            value={lgaGpt}
            onChange={setLgaGpt}
            step="0.01"
          />
        </div>
        <div className="brand-card flex justify-between items-center mb-3">
          <div>
            <div className="lbl" style={{ color: 'rgba(255,255,255,0.6)' }}>
              Required LGA Rate
            </div>
            <div
              className="font-display"
              style={{ fontSize: 32, fontWeight: 900, color: '#fff' }}
            >
              {lgaGpm.toFixed(2)}
            </div>
          </div>
          <div
            style={{
              fontSize: 14,
              fontWeight: 700,
              color: 'rgba(255,255,255,0.4)',
            }}
          >
            GPM
          </div>
        </div>
        <div className="flex gap-3">
          <ResultTile
            label="Equivalent PPT"
            value={lgaPptEq.toFixed(1)}
            unit="PPT = LGA × 4"
          />
          <ResultTile
            label="Dry Gel Rate"
            value={lgaPpmEq.toFixed(1)}
            unit="LBS/MIN"
          />
        </div>
      </ToolCard>

      {/* Guar Auger */}
      <ToolCard
        title="Pounds Per Minute & Guar Auger RPM"
        tab={TAB}
        formula="PPM = Rate × 0.042 × PPT · RPM = PPM ÷ PPR · LGA GPM = PPM ÷ 4"
      >
        <div className="grid-3 mb-3">
          <NumField
            label="Hydration Rate (BPM)"
            value={guarRate}
            onChange={setGuarRate}
            step="0.1"
            className=""
          />
          <NumField
            label="PPT / Gel Loading"
            value={guarPpt}
            onChange={setGuarPpt}
            step="0.1"
            className=""
          />
          <NumField
            label="Auger PPR (LBS/REV)"
            value={guarPpr}
            onChange={setGuarPpr}
            step="0.01"
            className=""
          />
        </div>
        <div className="grid-3 gap-2">
          <ResultTile
            label="Pounds Per Minute"
            value={guarPpm.toFixed(1)}
            unit="LBS/MIN (PPM)"
            emphasize
            className="tile"
          />
          <ResultTile
            label="Liquid Gel Rate"
            value={guarGpm.toFixed(1)}
            unit="GPM LGA"
            className="tile"
          />
          <ResultTile
            label="Guar Auger RPM"
            value={guarRpm.toFixed(1)}
            unit="RPM"
            emphasize
            className="tile"
          />
        </div>
      </ToolCard>

      {/* Tub Volume & Hydration Time */}
      <ToolCard
        title="Tub Volume & Hydration Time"
        tab={TAB}
        formula="Tub Vol = Capacity × Level% / 100 · Time = Tub Vol / Clean Rate"
      >
        <div className="grid-2 mb-3">
          <NumField
            label="Tub Capacity (BBL)"
            value={tubCap}
            onChange={setTubCap}
            step="1"
            className=""
          />
          <NumField
            label="Job Clean Rate (BPM)"
            value={tubCleanRate}
            onChange={setTubCleanRate}
            step="0.1"
            className=""
          />
        </div>
        <div className="mb-3">
          <div className="flex justify-between items-center mb-2">
            <label className="lbl" style={{ margin: 0 }}>
              Tub Level
            </label>
            <span
              className="font-display"
              style={{ color: 'var(--brand)', fontWeight: 900 }}
            >
              {Math.round(tubLevel)}%
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            value={tubLevel}
            onChange={(e) => setTubLevel(parseFloat(e.target.value) || 0)}
            aria-label="Tub level percent"
          />
        </div>
        <div className="flex gap-3">
          <ResultTile
            label="Tub Volume"
            value={tubVol.toFixed(1)}
            unit="BBL"
          />
          <ResultTile
            label="Hydration Time"
            value={tubTime !== null ? tubTime.toFixed(1) : '–'}
            unit="MIN"
            emphasize
          />
        </div>
      </ToolCard>

      {/* LGA Needed for Tub */}
      <ToolCard
        title="LGA Needed for Tub"
        tab={TAB}
        formula="LGA Needed (gal) = Tub Volume (bbl) × 0.042 × LGA Set Point (gpt)"
      >
        <div className="grid-2 mb-3">
          <NumField
            label="Tub Volume (BBL)"
            value={needVol}
            onChange={setNeedVol}
            step="0.1"
            className=""
          />
          <NumField
            label="LGA Set Point (GPT)"
            value={needGpt}
            onChange={setNeedGpt}
            step="0.1"
            className=""
          />
        </div>
        <div className="flex gap-3">
          <ResultTile
            label="LGA Needed"
            value={needGal.toFixed(1)}
            unit="GAL"
            emphasize
          />
          <ResultTile
            label="Dry Guar Equivalent"
            value={needLbs.toFixed(1)}
            unit="LBS"
          />
        </div>
        <button
          type="button"
          className="btn btn-ghost mt-3"
          style={{ width: '100%', fontSize: 12 }}
          onClick={() => setNeedVol(tubVol)}
        >
          Use Tub Volume from Hydration Time tool
        </button>
      </ToolCard>

      {/* Gel Used to Visc Up Tub */}
      <ToolCard
        title="Gel Used to Visc Up Tub"
        tab={TAB}
        formula="Gel Used (lbs) = Tub Volume (bbl) × 0.042 × PPT"
      >
        <div className="grid-2 mb-3">
          <NumField
            label="Tub Volume (BBL)"
            value={vuVol}
            onChange={setVuVol}
            step="0.1"
            className=""
          />
          <NumField
            label="PPT / Gel Loading"
            value={vuPpt}
            onChange={setVuPpt}
            step="0.1"
            className=""
          />
        </div>
        <div className="flex gap-3">
          <ResultTile
            label="Gel Used (Dry)"
            value={vuLbs.toFixed(1)}
            unit="LBS"
            emphasize
          />
          <ResultTile
            label="LGA Equivalent"
            value={vuLga.toFixed(1)}
            unit="GAL"
          />
        </div>
      </ToolCard>

      {/* Increase Tub Viscosity */}
      <ToolCard
        title="Gel Used to Increase Tub Viscosity"
        tab={TAB}
        formula="Gel Used (lbs) = Tub Volume × 0.042 × (Target cp − Current cp)"
      >
        <div className="grid-3 mb-3">
          <NumField
            label="Tub Volume (BBL)"
            value={tvVol}
            onChange={setTvVol}
            step="0.1"
            className=""
          />
          <NumField
            label="Current Visc (CP)"
            value={tvCurrent}
            onChange={setTvCurrent}
            step="0.1"
            className=""
          />
          <NumField
            label="Target Visc (CP)"
            value={tvTarget}
            onChange={setTvTarget}
            step="0.1"
            className=""
          />
        </div>
        <div className="flex gap-3">
          <ResultTile
            label="Gel Needed (Dry)"
            value={tvDryLbs.toFixed(1)}
            unit="LBS"
            emphasize
          />
          <ResultTile
            label="LGA Needed"
            value={tvLga.toFixed(1)}
            unit="GAL"
          />
        </div>
      </ToolCard>

      {/* Design Gel for Stage */}
      <ToolCard
        title="Design Gel Used for Stage"
        tab={TAB}
        formula="Design Gel (lbs) = Stage Volume (bbl) × 0.042 × PPT"
      >
        <div className="flex gap-3 mb-3">
          <NumField
            label="Gel Stage Volume (BBL)"
            value={dgBbl}
            onChange={setDgBbl}
            step="0.1"
          />
          <NumField
            label="PPT / Gel Loading"
            value={dgPpt}
            onChange={setDgPpt}
            step="0.1"
          />
        </div>
        <div className="flex gap-3">
          <ResultTile
            label="Design Gel Used"
            value={dgLbs.toFixed(1)}
            unit="LBS"
            emphasize
          />
          <ResultTile
            label="Design LGA"
            value={dgLga.toFixed(1)}
            unit="GAL"
          />
        </div>
      </ToolCard>

      {/* LGA Tote Volume */}
      <ToolCard
        title="LGA Tote Volume from Strap"
        tab={TAB}
        formula="LGA Tote Volume (gal) = Cap Factor × Strap (in) — default 12.33 (750-gal gel tote)"
      >
        <div className="flex gap-3 mb-3">
          <NumField
            label="LGA Strap (IN)"
            value={lgaStrap}
            onChange={setLgaStrap}
            step="0.1"
          />
          <NumField
            label="Cap Factor (GAL/IN)"
            value={lgaCap}
            onChange={setLgaCap}
            step="0.01"
          />
        </div>
        <ResultTile
          label="LGA Tote Volume"
          value={lgaToteGal.toFixed(1)}
          unit="GAL"
          emphasize
          className="tile"
        />
      </ToolCard>

      {/* End LGA Tote Volume */}
      <ToolCard
        title="End LGA Tote Volume"
        tab={TAB}
        formula="End Volume = Start Volume − LGA Needed · End Strap = End Vol / Cap Factor"
      >
        <div className="grid-2 mb-3">
          <NumField
            label="Start Strap (IN)"
            value={endStrap}
            onChange={setEndStrap}
            step="0.1"
            className=""
          />
          <NumField
            label="Cap Factor (GAL/IN)"
            value={endCap}
            onChange={setEndCap}
            step="0.01"
            className=""
          />
          <NumField
            label="LGA Needed (GAL)"
            value={endNeed}
            onChange={setEndNeed}
            step="0.1"
            className=""
          />
          <div>
            <label className="lbl">Or Start Volume (GAL)</label>
            <input
              type="number"
              className="field"
              value={endStartVolManual}
              step="0.1"
              placeholder="auto from strap"
              onChange={(e) => setEndStartVolManual(e.target.value)}
            />
          </div>
        </div>
        <div className="flex gap-3">
          <ResultTile
            label="Start Volume"
            value={endStartVol.toFixed(1)}
            unit="GAL"
          />
          <ResultTile
            label="End Volume"
            value={endVol.toFixed(1)}
            unit="GAL"
            emphasize
          />
          <ResultTile
            label="End Strap"
            value={endStrapOut.toFixed(1)}
            unit="IN"
          />
        </div>
      </ToolCard>

      {/* Mid-Stage Tote Swap */}
      <ToolCard
        title="Mid-Stage Tote Swap Predictor"
        tab={TAB}
        formula="T1 Gel = (T1 Start − T1 Swap) × Fac · T2 End = T2 Start − max(0, Total − T1 Gel) / Fac"
      >
        <div className="grid-2 mb-3">
          <NumField
            label="Tote 1 Start Strap (IN)"
            value={ts1Start}
            onChange={setTs1Start}
            step="0.5"
            className=""
          />
          <NumField
            label="Tote 1 Swap Strap (IN)"
            value={ts1Swap}
            onChange={setTs1Swap}
            step="0.5"
            className=""
          />
          <NumField
            label="Tote 2 Start Strap (IN)"
            value={ts2Start}
            onChange={setTs2Start}
            step="0.5"
            className=""
          />
          <NumField
            label="Stage Gel Used (GAL)"
            value={tsTotal}
            onChange={setTsTotal}
            className=""
          />
        </div>
        <div className="mb-3">
          <NumField
            label="Tote Capacity Factor (GAL/IN)"
            value={tsFac}
            onChange={setTsFac}
            step="0.01"
            className=""
          />
        </div>
        <div className="flex gap-3">
          <ResultTile
            label="Gel From Tote 1"
            value={ts1Gel.toFixed(1)}
            unit="GAL"
          />
          <ResultTile
            label="Tote 2 Ending Strap"
            value={ts2End.toFixed(1)}
            unit="IN"
            emphasize
          />
        </div>
      </ToolCard>
    </div>
  );
}

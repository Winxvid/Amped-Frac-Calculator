import { useEffect, useRef, useState } from 'react';
import { F } from '../../lib/formulas';
import { useNavigation } from '../../context/NavigationContext';
import { SectionHeader } from '../../components/ui/SectionHeader';
import { ToolCard } from '../../components/tools/ToolCard';
import { NumField, ResultTile } from '../../components/ui/NumField';

const TAB = 'blender';

export function BlenderPage() {
  const { tab } = useNavigation();
  const active = tab === 'blender';

  // Clean & Slurry conversion
  const [convClean, setConvClean] = useState(65);
  const [convSlurry, setConvSlurry] = useState(72.8);
  const [convPpa, setConvPpa] = useState(3.0);
  const [convSg, setConvSg] = useState(2.65);

  // Screw concentration
  const [screwClean, setScrewClean] = useState(65);
  const [screwPpa, setScrewPpa] = useState(3.0);
  const [screwPpr, setScrewPpr] = useState(3.0);
  const [aug1, setAug1] = useState(91);
  const [aug2, setAug2] = useState(91);
  const [aug3, setAug3] = useState(91);

  // Design clean from slurry
  const [desSlurry, setDesSlurry] = useState(75);
  const [desPpa, setDesPpa] = useState(4.0);
  const [desSg, setDesSg] = useState(2.65);

  // Split flow CLD
  const [splitDesignPpa, setSplitDesignPpa] = useState(3.5);
  const [splitBlenderRate, setSplitBlenderRate] = useState(40);
  const [splitTotalRate, setSplitTotalRate] = useState(80);

  // Auger PPR
  const [augR, setAugR] = useState(3.0);
  const [shaftR, setShaftR] = useState(1.0);
  const [pitch, setPitch] = useState(6.0);
  const [bulk, setBulk] = useState(100);
  const [oldPpr, setOldPpr] = useState(3.0);
  const [actTotal, setActTotal] = useState(42000);
  const [desTotal, setDesTotal] = useState(40000);

  // Metric
  const [slurryM3, setSlurryM3] = useState(10.0);
  const [ppaKgm3, setPpaKgm3] = useState(360);
  const [metricSg, setMetricSg] = useState(2.65);

  // Test config + stopwatch
  const [blRate, setBlRate] = useState(60);
  const [blGpt, setBlGpt] = useState(1.0);
  const [blFine, setBlFine] = useState(1.0);
  const [blBucket, setBlBucket] = useState(0.264);
  const [blDesired, setBlDesired] = useState(1.0);
  const [timerSec, setTimerSec] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [measuredGpm, setMeasuredGpm] = useState(0);
  const [errorPct, setErrorPct] = useState(0);
  const [recFine, setRecFine] = useState(1);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startRef = useRef(0);

  // Bucket test adjustments
  const [bktGal, setBktGal] = useState(5);
  const [bktRate, setBktRate] = useState(95);
  const [bktGpt, setBktGpt] = useState(0.5);
  const [bktActual, setBktActual] = useState(16);

  useEffect(() => {
    if (timerRunning) {
      startRef.current = performance.now() - timerSec * 1000;
      timerRef.current = setInterval(() => {
        setTimerSec((performance.now() - startRef.current) / 1000);
      }, 50);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timerRunning]);

  // Clean & Slurry
  const avf = convSg > 0 ? 1 / (8.34 * convSg) : 0;
  const yieldVal = convPpa * avf + 1;
  const cfr = yieldVal > 0 ? 1 / yieldVal : 1;
  const calcSlurry = convClean * yieldVal;
  const calcClean = convSlurry * cfr;

  // Screw
  const reqRpm = screwPpr > 0 ? (screwClean * screwPpa * 42) / screwPpr : 0;
  const actRpm = aug1 + aug2 + aug3;
  const screwConc = screwClean > 0 ? (actRpm * screwPpr) / (screwClean * 42) : 0;
  const lbsMin = actRpm * screwPpr;
  const propPpm = lbsMin / 3;

  // Design clean
  const desDenom = desSg > 0 ? desPpa / (8.34 * desSg) + 1 : 1;
  const designClean = desDenom > 0 ? desSlurry / desDenom : 0;

  // Split CLD
  const spRatio = splitTotalRate > 0 ? splitBlenderRate / splitTotalRate : 1;
  const blenderConc = spRatio > 0 ? splitDesignPpa / spRatio : 0;

  // Auger PPR
  const theoPpr =
    (1.41 * (augR ** 2 - shaftR ** 2) * pitch * bulk) / 1728;
  const recalPpr = desTotal > 0 ? oldPpr * (actTotal / desTotal) : oldPpr;

  // Metric
  const mDenom = metricSg > 0 ? ppaKgm3 / (metricSg * 999.3524) + 1 : 1;
  const cleanM3 = mDenom > 0 ? slurryM3 / mDenom : 0;
  const cleanBpm = cleanM3 * 6.2898;

  // Test config theoretical
  const thGpm = F.gpm(blRate, blGpt, blFine);
  const thTime = thGpm > 0 ? (blDesired / thGpm) * 60 : 0;

  // Bucket test
  const bktDenom = bktRate * 0.042 * bktGpt;
  const bktEst = bktDenom > 0 ? (60 * bktGal) / bktDenom : 0;
  const bktError = bktActual > 0 ? (bktEst / bktActual - 1) * 100 : 0;
  const bktNewFine = bktActual > 0 ? bktEst / bktActual : 1;

  const handleStartStop = () => {
    if (timerRunning) {
      setTimerRunning(false);
      if (timerSec > 0) {
        const measured = (blBucket / timerSec) * 60;
        const target = thGpm;
        const err = target > 0 ? ((measured - target) / target) * 100 : 0;
        const base = F.gpm(blRate, blGpt, 1);
        const fine = base > 0 ? measured / base : 1;
        setMeasuredGpm(measured);
        setErrorPct(err);
        setRecFine(fine);
        setShowResults(true);
      }
    } else {
      setShowResults(false);
      setTimerRunning(true);
    }
  };

  const handleReset = () => {
    setTimerRunning(false);
    setTimerSec(0);
    setShowResults(false);
  };

  return (
    <div className={`section${active ? ' active' : ''}`} id="s-blender">
      <SectionHeader
        tab={TAB}
        title="BLENDER CALCULATIONS"
        subtitle="CLEAN & SLURRY FORMULAS"
      />

      <ToolCard title="Clean & Slurry Rate Conversion (CFR & Yield)" tab={TAB}>
        <div className="grid-2 mb-3">
          <NumField label="Clean Rate (BPM)" value={convClean} onChange={setConvClean} />
          <NumField label="Slurry Rate (BPM)" value={convSlurry} onChange={setConvSlurry} step="0.1" />
          <NumField label="Proppant Conc (PPA / PPG)" value={convPpa} onChange={setConvPpa} step="0.1" />
          <NumField label="Sand SG" value={convSg} onChange={setConvSg} step="0.01" />
        </div>
        <div className="grid-3 gap-2 mb-3">
          <ResultTile label="Abs Vol Factor (AVF)" value={avf.toFixed(4)} unit="GAL/LB" />
          <ResultTile label="Slurry Yield" value={yieldVal.toFixed(4)} unit="GAL/GAL" />
          <ResultTile label="Clean Fluid Ratio (CFR)" value={cfr.toFixed(4)} emphasize />
        </div>
        <div className="flex gap-3">
          <ResultTile label="Calc Slurry Rate (from Clean)" value={calcSlurry.toFixed(1)} unit="BPM" emphasize />
          <ResultTile label="Calc Clean Rate (from Slurry)" value={calcClean.toFixed(1)} unit="BPM" emphasize />
        </div>
      </ToolCard>

      <ToolCard title="Screw Concentration & Total Auger RPM" tab={TAB}>
        <div className="grid-3 mb-3">
          <NumField label="Clean Rate (BPM)" value={screwClean} onChange={setScrewClean} />
          <NumField label="Target PPA (PPG)" value={screwPpa} onChange={setScrewPpa} step="0.1" />
          <NumField label="Auger PPR (LBS/REV)" value={screwPpr} onChange={setScrewPpr} step="0.1" />
          <NumField label="Auger 1 RPM" value={aug1} onChange={setAug1} />
          <NumField label="Auger 2 RPM" value={aug2} onChange={setAug2} />
          <NumField label="Auger 3 RPM" value={aug3} onChange={setAug3} />
        </div>
        <div className="grid-3 gap-2 mb-3">
          <ResultTile label="Req Total RPM" value={F.c(reqRpm)} unit="RPM" emphasize />
          <ResultTile label="Actual Total RPM" value={F.c(actRpm)} unit="RPM" />
          <ResultTile label="Calc Screw Conc" value={screwConc.toFixed(2)} unit="PPA" emphasize />
        </div>
        <div className="flex gap-3">
          <ResultTile label="Proppant Rate" value={F.c(lbsMin)} unit="LBS/MIN" />
          <ResultTile label="Prop PPM" value={propPpm.toFixed(1)} unit="PPM" />
        </div>
      </ToolCard>

      <ToolCard title="Design Clean Rate from Design Slurry Rate" tab={TAB}>
        <div className="grid-3 mb-3">
          <NumField label="Design Slurry Rate (BPM)" value={desSlurry} onChange={setDesSlurry} />
          <NumField label="Design Proppant Conc (PPA)" value={desPpa} onChange={setDesPpa} step="0.1" />
          <NumField label="Sand SG" value={desSg} onChange={setDesSg} step="0.01" />
        </div>
        <ResultTile label="Design Clean Rate" value={designClean.toFixed(1)} unit="BPM" emphasize className="tile" />
      </ToolCard>

      <ToolCard title="Split Flow Blender Concentration (CLD)" tab={TAB}>
        <div className="grid-3 mb-3">
          <NumField label="Design PPA (PPG)" value={splitDesignPpa} onChange={setSplitDesignPpa} step="0.1" />
          <NumField label="Blender Clean Rate (BPM)" value={splitBlenderRate} onChange={setSplitBlenderRate} />
          <NumField label="Total Combined Clean Rate (BPM)" value={splitTotalRate} onChange={setSplitTotalRate} />
        </div>
        <ResultTile label="Blender Concentration (CLD)" value={blenderConc.toFixed(2)} unit="PPG" emphasize className="tile" />
      </ToolCard>

      <ToolCard title="Auger PPR & Dry Add Recalibration" tab={TAB}>
        <div className="mb-3" style={{ background: 'var(--surface)', padding: 12, borderRadius: 10 }}>
          <div className="lbl mb-2">Theoretical PPR from Dimensions</div>
          <div className="grid-2 mb-2">
            <NumField label="Auger Radius (IN)" value={augR} onChange={setAugR} step="0.1" />
            <NumField label="Shaft Radius (IN)" value={shaftR} onChange={setShaftR} step="0.1" />
            <NumField label="Pitch (IN)" value={pitch} onChange={setPitch} step="0.1" />
            <NumField label="Bulk Density (LBS/FT³)" value={bulk} onChange={setBulk} />
          </div>
          <ResultTile label="Theoretical PPR" value={theoPpr.toFixed(2)} unit="LBS/REV" emphasize className="tile" />
        </div>
        <div style={{ background: 'var(--surface)', padding: 12, borderRadius: 10 }}>
          <div className="lbl mb-2">Recalibrate PPR from Job Totals</div>
          <div className="grid-3 mb-2">
            <NumField label="Old PPR (LBS/REV)" value={oldPpr} onChange={setOldPpr} step="0.1" />
            <NumField label="Actual Total (LBS)" value={actTotal} onChange={setActTotal} />
            <NumField label="Designed Total (LBS)" value={desTotal} onChange={setDesTotal} />
          </div>
          <ResultTile label="Recalibrated PPR" value={recalPpr.toFixed(2)} unit="LBS/REV" emphasize className="tile" />
        </div>
      </ToolCard>

      <ToolCard title="Metric / Screwless Blender Clean Rate" tab={TAB}>
        <div className="grid-3 mb-3">
          <NumField label="Slurry Rate (m³/min)" value={slurryM3} onChange={setSlurryM3} step="0.1" />
          <NumField label="Proppant Conc (kg/m³)" value={ppaKgm3} onChange={setPpaKgm3} />
          <NumField label="Sand SG" value={metricSg} onChange={setMetricSg} step="0.01" />
        </div>
        <div className="flex gap-3">
          <ResultTile label="Calc Clean Rate (m³/min)" value={cleanM3.toFixed(2)} unit="M³/MIN" emphasize />
          <ResultTile label="Calc Clean Rate (BPM)" value={cleanBpm.toFixed(1)} unit="BPM" emphasize />
        </div>
      </ToolCard>

      <ToolCard title="Test Configuration" tab={TAB}>
        <div className="grid-2 mb-3">
          <NumField label="Simulated Rate (BPM)" value={blRate} onChange={setBlRate} step="0.1" />
          <NumField label="Target GPT" value={blGpt} onChange={setBlGpt} step="0.01" />
          <NumField label="Fine Adjust" value={blFine} onChange={setBlFine} step="0.001" />
          <NumField label="Bucket Volume (GAL)" value={blBucket} onChange={setBlBucket} step="0.001" />
        </div>
        <NumField label="Desired Volume (GAL)" value={blDesired} onChange={setBlDesired} step="0.001" className="" />
      </ToolCard>

      <ToolCard title="Bucket Test Targets" tab={TAB}>
        <div className="flex justify-between items-center gap-3">
          <div>
            <div className="lbl">Theoretical GPM</div>
            <div className="font-display" style={{ fontSize: 28, fontWeight: 900, color: 'var(--brand)' }}>
              {thGpm.toFixed(3)}
            </div>
          </div>
          <div className="text-right">
            <div className="lbl">Expected Time</div>
            <div className="font-display" style={{ fontSize: 28, fontWeight: 900 }}>
              {thTime.toFixed(1)}s
            </div>
          </div>
        </div>
      </ToolCard>

      <ToolCard title="Bucket Test Stopwatch" tab={TAB}>
        <div className="timer mb-4" style={{ textAlign: 'center', fontSize: 36, fontWeight: 900 }}>
          {timerSec.toFixed(1)}s
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            className="btn btn-brand flex-1"
            style={{ fontSize: 15, padding: 14 }}
            onClick={handleStartStop}
          >
            {timerRunning ? '⏹ Stop' : '▶ Start'}
          </button>
          <button
            type="button"
            className="btn btn-ghost flex-1"
            style={{ fontSize: 14, padding: 14 }}
            onClick={handleReset}
          >
            ↺ Reset
          </button>
        </div>
      </ToolCard>

      {showResults ? (
        <ToolCard title="Calibration Results" tab={TAB}>
          <div className="flex gap-3 mb-3">
            <ResultTile label="Target GPM" value={thGpm.toFixed(3)} />
            <ResultTile label="Measured GPM" value={measuredGpm.toFixed(3)} emphasize />
          </div>
          <div className="flex gap-3">
            <ResultTile
              label="% Error"
              value={`${errorPct.toFixed(1)}%`}
              className="tile flex-1"
            />
            <ResultTile label="Rec. Fine Adjust" value={recFine.toFixed(3)} emphasize />
          </div>
        </ToolCard>
      ) : null}

      <ToolCard title="Bucket Test Time & Adjustments" tab={TAB}>
        <div className="grid-2 mb-3">
          <NumField label="Gallons Filled" value={bktGal} onChange={setBktGal} />
          <NumField label="Clean Rate (BPM)" value={bktRate} onChange={setBktRate} />
          <NumField label="Setpoint (GPT)" value={bktGpt} onChange={setBktGpt} step="0.1" />
          <NumField label="Actual Time (SEC)" value={bktActual} onChange={setBktActual} />
        </div>
        <div className="flex gap-3 mb-3">
          <ResultTile label="Estimated Time" value={bktEst.toFixed(1)} unit="SEC" />
          <ResultTile label="% Error" value={`${bktError.toFixed(1)}%`} />
        </div>
        <ResultTile label="New Fine Adjust" value={bktNewFine.toFixed(2)} emphasize className="tile" />
      </ToolCard>
    </div>
  );
}

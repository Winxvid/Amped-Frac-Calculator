import { useState } from 'react';
import { F } from '../../lib/formulas';
import { useNavigation } from '../../context/NavigationContext';
import { ToolCard } from '../../components/tools/ToolCard';
import { NumField, ResultTile } from '../../components/ui/NumField';
import { ANALOG_DEVICES } from '../shared/fieldData';

const TAB = 'lime';

const HARDWARE_K_FACTORS: { name: string; k: number }[] = [
  { name: 'Waukesha 6', k: 0.0164 },
  { name: 'Waukesha 18', k: 0.058 },
  { name: 'Continental 2-CL6', k: 0.104 },
  { name: 'Gel micromotion', k: 0.01 },
  { name: 'Acrison', k: 0.079 },
  { name: 'Sand screw', k: 1.2 },
  { name: 'Turbine', k: 0.72 },
];

const K_PROFILES: { label: string; value: string; k: number }[] = [
  { label: 'Standard Flowmeter (850 K-Factor)', value: '850', k: 850 },
  { label: 'Mag Meter (2500 K-Factor)', value: '2500', k: 2500 },
  { label: 'Custom Manual Vector', value: 'custom', k: 850 },
];

export function LimePage() {
  const { tab } = useNavigation();
  const active = tab === 'lime';

  // Correction vectors
  const [scale, setScale] = useState(1.0);
  const [fine, setFine] = useState(1.0);

  // K-profile
  const [profile, setProfile] = useState('850');
  const [customK, setCustomK] = useState(850);
  const [freq, setFreq] = useState(60);

  // Analog 4-20mA
  const [deviceIdx, setDeviceIdx] = useState(0);
  const [rawMa, setRawMa] = useState(12);
  const [analogMin, setAnalogMin] = useState(ANALOG_DEVICES[0].min);
  const [analogMax, setAnalogMax] = useState(ANALOG_DEVICES[0].max);
  const [analogFine, setAnalogFine] = useState(1.0);

  // Transducer
  const [rating, setRating] = useState(15000);
  const [inputPsi, setInputPsi] = useState(12000);
  const [inputMa, setInputMa] = useState(14.0);

  // Freq pinion
  const [fcHz, setFcHz] = useState(300);
  const [fcTeeth, setFcTeeth] = useState(60);
  const [fcRatio, setFcRatio] = useState(2.5);

  // K recal
  const [krOld, setKrOld] = useState(850);
  const [krMicro, setKrMicro] = useState(10.5);
  const [krMag, setKrMag] = useState(10.0);

  const mult = scale * fine;

  const appliedK = profile === 'custom' ? customK : parseFloat(profile) || 850;
  const gpm = appliedK > 0 ? (freq / appliedK) * 60 : 0;

  const scaled =
    (((analogMax - analogMin) / 16) * (rawMa - 4) + analogMin) * analogFine;

  const outMa = rating > 0 ? (inputPsi / rating) * 16 + 4 : 4;
  const outPsi = Math.max(0, (inputMa - 4) / 16) * rating;

  const pinion = fcTeeth > 0 ? (fcHz * 60) / fcTeeth : 0;
  const engine = pinion * fcRatio;

  const newK = krMag > 0 ? krOld * (krMicro / krMag) : krOld;

  const onDeviceChange = (idx: number) => {
    setDeviceIdx(idx);
    const d = ANALOG_DEVICES[idx] || ANALOG_DEVICES[0];
    setAnalogMin(d.min);
    setAnalogMax(d.max);
  };

  return (
    <div className={`section${active ? ' active' : ''}`} id="s-lime">
      <div className="mb-4">
        <div className="sec-title">LIME Calibration</div>
        <div className="sec-sub">Liquid Additive Metering Equipment scaling &amp; correction</div>
      </div>

      <ToolCard title="Correction Vectors" tab={TAB}>
        <div className="flex gap-3 mb-3">
          <NumField label="Raw Meter Scale" value={scale} onChange={setScale} step="0.001" />
          <NumField label="Fine Calibration Factor" value={fine} onChange={setFine} step="0.001" />
        </div>
        <div className="brand-card flex justify-between items-center">
          <div>
            <div className="lbl" style={{ color: 'rgba(255,255,255,0.6)' }}>
              Net System Multiplier
            </div>
            <div className="font-display" style={{ fontSize: 36, fontWeight: 900, color: '#fff' }}>
              {mult.toFixed(3)}
            </div>
          </div>
          <span style={{ fontSize: 28, opacity: 0.2 }}>⚙</span>
        </div>
      </ToolCard>

      <ToolCard title="K-Factor Profile (Throughput)" tab={TAB}>
        <div className="mb-3">
          <label className="lbl">Active Meter Profile</label>
          <select
            className="field"
            value={profile}
            onChange={(e) => setProfile(e.target.value)}
          >
            {K_PROFILES.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
        </div>
        {profile === 'custom' && (
          <div className="mb-3">
            <NumField label="Custom K-Factor" value={customK} onChange={setCustomK} step="1" className="" />
          </div>
        )}
        <div className="flex gap-3 mb-3">
          <NumField label="Signal Frequency (HZ)" value={freq} onChange={setFreq} step="0.1" />
          <ResultTile label="Applied K-Factor" value={F.n(appliedK, 0)} emphasize />
        </div>
        <div className="surface-card text-center" style={{ padding: 20 }}>
          <div className="lbl" style={{ display: 'block', marginBottom: 8 }}>
            Calculated Throughput
          </div>
          <div className="font-display" style={{ fontSize: 48, fontWeight: 900 }}>
            {gpm.toFixed(2)}
          </div>
          <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text2)', marginBottom: 8 }}>
            GPM
          </div>
          <div style={{ fontSize: 10, color: 'var(--text2)', fontWeight: 500 }}>
            gpm = (Hz / K) × 60 — real-time flux from encoder pulse frequency.
          </div>
        </div>
      </ToolCard>

      <ToolCard title="Analog Scaled Value (4-20mA)" tab={TAB}>
        <div className="grid-2 mb-3">
          <div>
            <label className="lbl">Device</label>
            <select
              className="field"
              value={deviceIdx}
              onChange={(e) => onDeviceChange(parseInt(e.target.value, 10))}
            >
              {ANALOG_DEVICES.map((d, i) => (
                <option key={d.label} value={i}>
                  {d.label} ({d.min}–{d.max})
                </option>
              ))}
            </select>
          </div>
          <NumField label="Raw mA" value={rawMa} onChange={setRawMa} step="0.1" />
        </div>
        <div className="grid-3 mb-3">
          <NumField label="Min Scaled" value={analogMin} onChange={setAnalogMin} />
          <NumField label="Max Scaled" value={analogMax} onChange={setAnalogMax} />
          <NumField label="Fine Adjust" value={analogFine} onChange={setAnalogFine} step="0.01" />
        </div>
        <ResultTile label="Scaled Value" value={scaled.toFixed(1)} emphasize className="tile" />
      </ToolCard>

      <ToolCard title="Pressure Transducer (4-20mA ↔ PSI) Dual Converter" tab={TAB}>
        <div className="mb-3">
          <NumField label="Transducer Rating (PSI)" value={rating} onChange={setRating} className="" />
        </div>
        <div className="grid-2 gap-3 mb-3">
          <div style={{ background: 'var(--surface)', padding: 12, borderRadius: 10 }}>
            <div className="lbl mb-2">Convert PSI → mA</div>
            <NumField label="Pressure (PSI)" value={inputPsi} onChange={setInputPsi} className="mb-2" />
            <ResultTile label="Calculated Signal" value={outMa.toFixed(2)} unit="mA" emphasize className="tile" />
          </div>
          <div style={{ background: 'var(--surface)', padding: 12, borderRadius: 10 }}>
            <div className="lbl mb-2">Convert mA → PSI</div>
            <NumField label="Signal (mA)" value={inputMa} onChange={setInputMa} step="0.1" className="mb-2" />
            <ResultTile label="Calculated Pressure" value={F.c(outPsi)} unit="PSI" emphasize className="tile" />
          </div>
        </div>
      </ToolCard>

      <ToolCard title="Frequency & Pinion Speed Calculator" tab={TAB}>
        <div className="grid-3 mb-3">
          <NumField label="Raw Freq (PUL/SEC)" value={fcHz} onChange={setFcHz} />
          <NumField label="Gear Teeth (PUL/REV)" value={fcTeeth} onChange={setFcTeeth} />
          <NumField label="Gear Ratio" value={fcRatio} onChange={setFcRatio} step="0.1" />
        </div>
        <div className="flex gap-3">
          <ResultTile label="Pinion Speed" value={F.c(pinion)} unit="RPM" emphasize />
          <ResultTile label="Engine Speed" value={F.c(engine)} unit="RPM" />
        </div>
      </ToolCard>

      <ToolCard title="K-Factor Recalibration Tool" tab={TAB}>
        <div className="grid-3 mb-3">
          <NumField label="Old K-Factor" value={krOld} onChange={setKrOld} />
          <NumField label="Micromotion Rate (GPM)" value={krMicro} onChange={setKrMicro} step="0.1" />
          <NumField label="Mag Pickup Rate (GPM)" value={krMag} onChange={setKrMag} step="0.1" />
        </div>
        <ResultTile label="Recalibrated K-Factor" value={newK.toFixed(1)} emphasize className="tile" />
      </ToolCard>

      <ToolCard title="Hardware Matrix" tab={TAB}>
        <p style={{ fontSize: 12, color: 'var(--text2)', marginBottom: 12 }}>
          Typical k-factors for common LIME / metering hardware (reference).
        </p>
        <div className="tbl-wrap">
          <table className="tbl">
            <thead>
              <tr>
                <th style={{ textAlign: 'left' }}>Device</th>
                <th className="tbl-right">Typical K-Factor</th>
              </tr>
            </thead>
            <tbody>
              {HARDWARE_K_FACTORS.map((row) => (
                <tr key={row.name}>
                  <td
                    style={{
                      padding: '9px 4px',
                      fontSize: 13,
                      fontWeight: 600,
                      borderBottom: '1px solid var(--border)',
                    }}
                  >
                    {row.name}
                  </td>
                  <td
                    className="tbl-right"
                    style={{
                      padding: '9px 4px',
                      fontSize: 13,
                      fontWeight: 900,
                      color: 'var(--brand)',
                      borderBottom: '1px solid var(--border)',
                      fontFamily: 'monospace',
                    }}
                  >
                    {row.k}
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

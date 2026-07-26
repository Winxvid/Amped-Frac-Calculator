import { useMemo, useState } from 'react';
import { F } from '../../lib/formulas';
import { useNavigation } from '../../context/NavigationContext';
import { SectionHeader } from '../../components/ui/SectionHeader';
import { ToolCard } from '../../components/tools/ToolCard';
import { NumField, ResultTile } from '../../components/ui/NumField';
import {
  ACRONYMS_DATA,
  FIELD_CONSTANTS,
  HOSE_FACTORS,
  TUBULAR_DATA,
  UNIT_CATEGORIES,
  UNIT_CONVERSIONS_SECTION1,
} from './data';

const TAB = 'math';

/**
 * Phase 3 — Pure React Math section (Fundamental Math tools).
 */
export function MathPage() {
  const { tab } = useNavigation();
  const active = tab === 'math';

  // Unit converter
  const [convCat, setConvCat] = useState('Volume');
  const [convVal, setConvVal] = useState(1);
  const [convFrom, setConvFrom] = useState('BBL');
  const [convTo, setConvTo] = useState('GAL');

  // Force
  const [forcePsi, setForcePsi] = useState(5000);
  const [forceArea, setForceArea] = useState(12.566);

  // Velocity
  const [velRate, setVelRate] = useState(60);
  const [velId, setVelId] = useState(4);

  // Hose
  const [hoseSize, setHoseSize] = useState('4');
  const [hoseId, setHoseId] = useState(4);
  const [hoseLen, setHoseLen] = useState(50);

  // Geometry
  const [rectL, setRectL] = useState(0);
  const [rectH, setRectH] = useState(0);
  const [circMode, setCircMode] = useState<'d' | 'r'>('d');
  const [circD, setCircD] = useState(0);
  const [tankL, setTankL] = useState(0);
  const [tankW, setTankW] = useState(0);
  const [tankH, setTankH] = useState(0);
  const [cylD, setCylD] = useState(0);
  const [cylL, setCylL] = useState(0);

  // Capacity reverse
  const [capBbl, setCapBbl] = useState(0);
  const [capFt, setCapFt] = useState(0);

  // Search
  const [acronymQ, setAcronymQ] = useState('');
  const [unitRefQ, setUnitRefQ] = useState('');

  const cat = UNIT_CATEGORIES[convCat] || UNIT_CATEGORIES.Volume;

  // Reset from/to when category changes
  const onCatChange = (c: string) => {
    setConvCat(c);
    const u = UNIT_CATEGORIES[c]?.units || [];
    setConvFrom(u[0] || '');
    setConvTo(u[1] || u[0] || '');
  };

  const convResult = useMemo(
    () => F.convertUnit(convVal, convCat, convFrom, convTo, UNIT_CATEGORIES),
    [convVal, convCat, convFrom, convTo],
  );
  const convToLbl = (cat.labels[convTo] || convTo || '').split(' ')[0];

  const forceLbs = forcePsi * forceArea;
  const velFps = F.ironVel(velRate, velId);

  const hoseFactor = useMemo(() => {
    if (hoseSize === 'custom') {
      const area = Math.PI * Math.pow(hoseId / 2, 2);
      return (area * 12) / 231;
    }
    return HOSE_FACTORS[hoseSize] ?? 0.6528;
  }, [hoseSize, hoseId]);
  const hoseGal = hoseFactor * hoseLen;

  const rectIn2 = rectL * rectH;
  const circRadius = circMode === 'r' ? circD : circD / 2;
  const circArea =
    circMode === 'r' ? Math.PI * circD * circD : F.circleArea(circD);
  const tankIn3 = tankL * tankW * tankH;
  const tankGal = tankIn3 / 231;
  const cylIn3 = F.cylVol(cylD, cylL);

  const capFactor =
    capFt > 0 ? ((capBbl * 42) / capFt).toFixed(4) : '0.0000';

  const acronyms = useMemo(() => {
    const q = acronymQ.trim().toLowerCase();
    if (!q) return ACRONYMS_DATA;
    return ACRONYMS_DATA.filter(
      (a) =>
        a.abbr.toLowerCase().includes(q) || a.name.toLowerCase().includes(q),
    );
  }, [acronymQ]);

  const unitRefs = useMemo(() => {
    const q = unitRefQ.trim().toLowerCase();
    if (!q) return UNIT_CONVERSIONS_SECTION1;
    return UNIT_CONVERSIONS_SECTION1.filter(
      (r) =>
        r.unit.toLowerCase().includes(q) ||
        r.symbol.toLowerCase().includes(q) ||
        r.conv.toLowerCase().includes(q),
    );
  }, [unitRefQ]);

  return (
    <div className={`section${active ? ' active' : ''}`} id="s-math">
      <SectionHeader tab={TAB} title="Fundamental Math" />

      {/* PEMDAS */}
      <ToolCard
        title="Order of Operations"
        tab={TAB}
        badge={
          <span className="badge badge-green" style={{ fontSize: 11 }}>
            Remember PEMDAS
          </span>
        }
      >
        <div className="grid-2 gap-2 mb-1">
          {[
            ['1', 'Parentheses', '( ) Bracketed operations first'],
            ['2', 'Exponents & Roots', 'x², √x, powers & roots'],
            ['3', 'Multiplication & Division', '× and ÷ left to right'],
            ['4', 'Addition & Subtraction', '+ and − left to right'],
          ].map(([n, t, d]) => (
            <div
              key={n}
              className="surface-card flex items-center gap-3"
              style={{ padding: '10px 14px' }}
            >
              <div
                className="font-display"
                style={{
                  fontSize: 20,
                  fontWeight: 900,
                  color: 'var(--brand)',
                  width: 24,
                }}
              >
                {n}
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700 }}>{t}</div>
                <div style={{ fontSize: 11, color: 'var(--text2)' }}>{d}</div>
              </div>
            </div>
          ))}
        </div>
      </ToolCard>

      {/* Unit converter */}
      <ToolCard title="Interactive Multi-Unit Converter" tab={TAB}>
        <div className="mb-3">
          <label className="lbl">Dimension Category</label>
          <select
            className="field"
            value={convCat}
            onChange={(e) => onCatChange(e.target.value)}
          >
            <option value="Volume">Volume (bbl, gal, ft³, in³, m³)</option>
            <option value="Density">Density (lbs/gal, g/ml, kg/m³, lb/ft³)</option>
            <option value="Weight">Weight (lb, kg)</option>
            <option value="Length">Length (ft, in)</option>
            <option value="Concentration">Concentration (ppt, g/L)</option>
          </select>
        </div>
        <div className="flex gap-3 mb-3">
          <NumField label="Value" value={convVal} onChange={setConvVal} />
          <div className="flex-1">
            <label className="lbl">From</label>
            <select
              className="field"
              value={convFrom}
              onChange={(e) => setConvFrom(e.target.value)}
            >
              {cat.units.map((u) => (
                <option key={u} value={u}>
                  {cat.labels[u] || u}
                </option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label className="lbl">To</label>
            <select
              className="field"
              value={convTo}
              onChange={(e) => setConvTo(e.target.value)}
            >
              {cat.units.map((u) => (
                <option key={u} value={u}>
                  {cat.labels[u] || u}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="brand-card flex justify-between items-center">
          <div>
            <div className="lbl" style={{ color: 'rgba(255,255,255,0.6)' }}>
              Converted Result
            </div>
            <div
              className="font-display"
              style={{ fontSize: 32, fontWeight: 900, color: '#fff' }}
            >
              {convResult.toFixed(4)}
            </div>
          </div>
          <div
            style={{
              fontSize: 14,
              fontWeight: 700,
              color: 'rgba(255,255,255,0.4)',
            }}
          >
            {convToLbl}
          </div>
        </div>
      </ToolCard>

      <ToolCard
        title="Force on an Area"
        tab={TAB}
        formula="Formula: Force (lbs) = Pressure (psi) × Surface Area (in²)"
      >
        <div className="flex gap-3 mb-3">
          <NumField label="Pressure (PSI)" value={forcePsi} onChange={setForcePsi} />
          <NumField
            label="Surface Area (IN²)"
            value={forceArea}
            onChange={setForceArea}
            step="0.001"
          />
        </div>
        <div className="flex gap-3">
          <ResultTile label="Total Force (LBS)" value={F.c(forceLbs)} emphasize />
          <ResultTile
            label="Force (KIPS / 1000 lbs)"
            value={(forceLbs / 1000).toFixed(2)}
          />
        </div>
      </ToolCard>

      <ToolCard
        title="Fluid Velocity in a Pipe"
        tab={TAB}
        formula="Formula: Fluid Velocity = Rate / (π × R²)"
      >
        <div className="flex gap-3 mb-3">
          <NumField
            label="Rate (BPM)"
            value={velRate}
            onChange={setVelRate}
            step="0.1"
          />
          <NumField
            label="Pipe Inner Diameter (IN)"
            value={velId}
            onChange={setVelId}
            step="0.01"
          />
        </div>
        <div className="flex gap-3">
          <ResultTile
            label="Velocity"
            value={velFps.toFixed(2)}
            unit="FT/S"
            emphasize
          />
          <ResultTile label="Velocity" value={F.c(velFps * 60)} unit="FT/MIN" />
        </div>
      </ToolCard>

      <ToolCard
        title="Hose Volume Factors & Calculator"
        tab={TAB}
        formula="Volume of Cylinder = πR² × Length. Standard hose benchmarks:"
      >
        <div className="grid-2 gap-2 mb-3">
          {[
            ['1 in Hose', '0.0408'],
            ['2 in Hose', '0.1632'],
            ['4 in Hose', '0.6528'],
            ['8 in Hose', '2.6100'],
          ].map(([lab, v]) => (
            <div key={lab} className="surface-card">
              <div className="lbl">{lab}</div>
              <div
                className="font-display"
                style={{ fontSize: 15, fontWeight: 800, color: 'var(--brand)' }}
              >
                {v}{' '}
                <span style={{ fontSize: 10, color: 'var(--text2)' }}>
                  gals/ft
                </span>
              </div>
            </div>
          ))}
        </div>
        <div className="flex gap-3 mb-3">
          <div className="flex-1">
            <label className="lbl">Hose Size</label>
            <select
              className="field"
              value={hoseSize}
              onChange={(e) => setHoseSize(e.target.value)}
            >
              <option value="1">1 in Hose (0.0408 gal/ft)</option>
              <option value="2">2 in Hose (0.1632 gal/ft)</option>
              <option value="4">4 in Hose (0.6528 gal/ft)</option>
              <option value="8">8 in Hose (2.6100 gal/ft)</option>
              <option value="custom">Custom ID</option>
            </select>
          </div>
          {hoseSize === 'custom' ? (
            <NumField
              label="Custom ID (IN)"
              value={hoseId}
              onChange={setHoseId}
              step="0.01"
            />
          ) : null}
          <NumField label="Length (FT)" value={hoseLen} onChange={setHoseLen} />
        </div>
        <div className="flex gap-3">
          <ResultTile
            label="Hose Volume"
            value={hoseGal.toFixed(2)}
            unit="GAL"
            emphasize
          />
          <ResultTile
            label="Hose Volume"
            value={(hoseGal / 42).toFixed(2)}
            unit="BBL"
          />
        </div>
      </ToolCard>

      <ToolCard title="Rectangle Area" tab={TAB}>
        <div className="flex gap-3 mb-3">
          <NumField label="Length (IN)" value={rectL} onChange={setRectL} />
          <NumField label="Height (IN)" value={rectH} onChange={setRectH} />
        </div>
        <div className="flex gap-3">
          <ResultTile label="Area" value={F.c(rectIn2)} unit="IN²" />
          <ResultTile
            label="Area"
            value={(rectIn2 / 144).toFixed(2)}
            unit="FT²"
            emphasize
          />
        </div>
      </ToolCard>

      <ToolCard title="Circle Area & Radius" tab={TAB}>
        <div className="flex justify-between items-center mb-3">
          <label className="lbl" style={{ margin: 0 }}>
            {circMode === 'd' ? 'Diameter (IN)' : 'Radius (IN)'}
          </label>
          <div className="flex gap-1">
            <button
              type="button"
              className={`quick-btn${circMode === 'd' ? ' sel' : ''}`}
              onClick={() => setCircMode('d')}
            >
              Diameter
            </button>
            <button
              type="button"
              className={`quick-btn${circMode === 'r' ? ' sel' : ''}`}
              onClick={() => setCircMode('r')}
            >
              Radius
            </button>
          </div>
        </div>
        <div className="mb-3">
          <NumField
            label={circMode === 'd' ? 'Diameter (IN)' : 'Radius (IN)'}
            value={circD}
            onChange={setCircD}
            step="0.001"
            className=""
          />
        </div>
        <div className="flex gap-3">
          <ResultTile label="Radius" value={circRadius.toFixed(4)} unit="IN" />
          <ResultTile
            label="Area"
            value={circArea.toFixed(4)}
            unit="IN²"
            emphasize
          />
        </div>
      </ToolCard>

      <ToolCard title="Tank / Cube Volume (Length × Width × Height)" tab={TAB}>
        <div className="grid-3 mb-3">
          <NumField label="Length (IN)" value={tankL} onChange={setTankL} className="" />
          <NumField label="Width (IN)" value={tankW} onChange={setTankW} className="" />
          <NumField label="Height (IN)" value={tankH} onChange={setTankH} className="" />
        </div>
        <div className="flex gap-3">
          <ResultTile label="Volume" value={F.c(tankIn3)} unit="IN³" />
          <ResultTile label="Volume" value={tankGal.toFixed(2)} unit="GAL" />
          <ResultTile
            label="Volume"
            value={(tankGal / 42).toFixed(2)}
            unit="BBL"
            emphasize
          />
        </div>
      </ToolCard>

      <ToolCard title="Cylinder Volume (πR² × Length)" tab={TAB}>
        <div className="flex gap-3 mb-3">
          <NumField
            label="Diameter (IN)"
            value={cylD}
            onChange={setCylD}
            step="0.001"
          />
          <NumField label="Length (IN)" value={cylL} onChange={setCylL} />
        </div>
        <div className="flex gap-3 mb-3">
          <ResultTile label="Volume (in³)" value={cylIn3.toFixed(4)} />
          <ResultTile
            label="Volume (ft³)"
            value={(cylIn3 / 1728).toFixed(6)}
            emphasize
          />
        </div>
        <div className="flex gap-3">
          <ResultTile label="Volume (gal)" value={(cylIn3 / 231).toFixed(4)} />
          <ResultTile
            label="Volume (bbl)"
            value={(cylIn3 / 231 / 42).toFixed(4)}
            emphasize
          />
        </div>
      </ToolCard>

      <ToolCard title="Capacity Factor (Reverse)" tab={TAB}>
        <div className="flex gap-3 mb-3">
          <NumField label="Total Barrels" value={capBbl} onChange={setCapBbl} />
          <NumField label="Depth (FT)" value={capFt} onChange={setCapFt} />
        </div>
        <ResultTile
          label="Capacity Factor"
          value={capFactor}
          unit="GAL/FT"
          emphasize
          className="tile"
        />
      </ToolCard>

      <ToolCard title="Casing Capacity Factors" tab={TAB}>
        <div className="tbl-wrap">
          <table className="tbl">
            <thead>
              <tr>
                <th style={{ textAlign: 'left' }}>Casing</th>
                <th className="tbl-right">ID (IN)</th>
                <th className="tbl-right">GAL/FT</th>
              </tr>
            </thead>
            <tbody>
              {TUBULAR_DATA.map((t) => (
                <tr key={t.type}>
                  <td
                    style={{
                      padding: '9px 4px',
                      fontSize: 13,
                      fontWeight: 600,
                      borderBottom: '1px solid var(--border)',
                    }}
                  >
                    {t.type}
                  </td>
                  <td
                    className="tbl-right"
                    style={{
                      padding: '9px 4px',
                      fontSize: 13,
                      borderBottom: '1px solid var(--border)',
                      fontFamily: 'monospace',
                    }}
                  >
                    {t.id.toFixed(3)}
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
                    {t.factor.toFixed(4)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ToolCard>

      <ToolCard title="Field Constants" tab={TAB}>
        <div className="tbl-wrap">
          <table className="tbl">
            <tbody>
              {FIELD_CONSTANTS.map(([k, v]) => (
                <tr key={k}>
                  <td
                    style={{
                      padding: '9px 4px',
                      fontSize: 13,
                      fontWeight: 600,
                      borderBottom: '1px solid var(--border)',
                    }}
                  >
                    {k}
                  </td>
                  <td
                    style={{
                      padding: '9px 4px',
                      fontSize: 13,
                      fontWeight: 900,
                      color: 'var(--brand)',
                      textAlign: 'right',
                      borderBottom: '1px solid var(--border)',
                      fontFamily: "'Space Grotesk', sans-serif",
                    }}
                  >
                    {v}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ToolCard>

      <ToolCard
        title="Section 1 Unit Conversions Reference"
        tab={TAB}
        badge={
          <span className="badge badge-green" style={{ fontSize: 11 }}>
            25 Standard Values
          </span>
        }
      >
        <div className="mb-3">
          <input
            type="text"
            className="field"
            placeholder="Search units…"
            value={unitRefQ}
            onChange={(e) => setUnitRefQ(e.target.value)}
          />
        </div>
        <div className="tbl-wrap">
          <table className="tbl">
            <thead>
              <tr>
                <th style={{ textAlign: 'left' }}>Unit</th>
                <th>Symbol</th>
                <th className="tbl-right">Conversion</th>
              </tr>
            </thead>
            <tbody>
              {unitRefs.map((r, i) => (
                <tr key={`${r.unit}-${r.conv}-${i}`}>
                  <td style={{ fontWeight: 600 }}>{r.unit}</td>
                  <td>{r.symbol}</td>
                  <td className="tbl-right" style={{ fontWeight: 700 }}>
                    {r.conv}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ToolCard>

      <ToolCard
        title="Acronyms & Abbreviations"
        tab={TAB}
        badge={
          <span className="badge badge-green" style={{ fontSize: 11 }}>
            Section 1 Reference
          </span>
        }
      >
        <div className="mb-3">
          <input
            type="text"
            className="field"
            placeholder="Search acronyms…"
            value={acronymQ}
            onChange={(e) => setAcronymQ(e.target.value)}
          />
        </div>
        <div className="grid-2 gap-2">
          {acronyms.map((a) => (
            <div key={a.abbr} className="surface-card">
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 900,
                  color: 'var(--brand)',
                  fontFamily: "'Space Grotesk', sans-serif",
                }}
              >
                {a.abbr}
              </div>
              <div style={{ fontSize: 11, color: 'var(--text2)', marginTop: 2 }}>
                {a.name}
              </div>
            </div>
          ))}
        </div>
      </ToolCard>
    </div>
  );
}

import { useState, useEffect } from 'react';

type NumFieldProps = {
  label: string;
  value: number | string;
  onChange: (v: number) => void;
  step?: string | number;
  placeholder?: string;
  className?: string;
};

export function NumField({
  label,
  value,
  onChange,
  step,
  placeholder,
  className = 'flex-1',
}: NumFieldProps) {
  const [localValue, setLocalValue] = useState(value === 0 ? '' : String(value));

  // Sync when the external value changes (e.g. reset)
  useEffect(() => {
    setLocalValue(value === 0 ? '' : String(value));
  }, [value]);

  return (
    <div className={className}>
      <label className="lbl">{label}</label>
      <input
        type="number"
        className="field"
        value={localValue}
        step={step}
        placeholder={placeholder ?? '0'}
        onChange={(e) => {
          setLocalValue(e.target.value);
          const parsed = parseFloat(e.target.value);
          onChange(isNaN(parsed) ? 0 : parsed);
        }}
        onBlur={() => {
          // Normalize display on blur (strip trailing dots/zeros etc.)
          const parsed = parseFloat(localValue);
          if (!isNaN(parsed)) setLocalValue(String(parsed));
        }}
      />
    </div>
  );
}

type ResultTileProps = {
  label: string;
  value: string | number;
  unit?: string;
  emphasize?: boolean;
  className?: string;
};

export function ResultTile({
  label,
  value,
  unit,
  emphasize,
  className = 'tile flex-1',
}: ResultTileProps) {
  return (
    <div className={className}>
      <div className="lbl">{label}</div>
      <div className="val" style={emphasize ? { color: 'var(--brand)' } : undefined}>
        {value}
      </div>
      {unit ? <div className="unit">{unit}</div> : null}
    </div>
  );
}

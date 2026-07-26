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
  return (
    <div className={className}>
      <label className="lbl">{label}</label>
      <input
        type="number"
        className="field"
        value={value}
        step={step}
        placeholder={placeholder}
        onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
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

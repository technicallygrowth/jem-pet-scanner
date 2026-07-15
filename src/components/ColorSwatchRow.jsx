import './ColorSwatchRow.css';

export default function ColorSwatchRow({ label, options, value, onChange }) {
  return (
    <div className="color-swatch-row">
      <span className="color-swatch-row__label">{label}</span>
      <div className="color-swatch-row__options">
        {options.map((option) => (
          <button
            key={option.key}
            type="button"
            className={
              option.key === value
                ? 'color-swatch-row__swatch is-selected'
                : 'color-swatch-row__swatch'
            }
            style={{ background: option.hex }}
            aria-label={option.label}
            aria-pressed={option.key === value}
            onClick={() => onChange(option.key)}
          />
        ))}
      </div>
    </div>
  );
}

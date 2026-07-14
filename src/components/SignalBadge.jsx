import { useTranslation } from 'react-i18next';
import './SignalBadge.css';

const ICONS = { met: '✓', partial: '~', none: '✕', missing: '?' };

// Every state uses the SAME visual vocabulary regardless of what the
// underlying fact means for the pet — green/amber/gray are never a moral
// score (see docs/plan-app-mascotas-escaner.md section 3): green just means
// "this factual claim is confirmed true", not "good news".
export default function SignalBadge({ label, state }) {
  const { t } = useTranslation();
  return (
    <div className={`signal-badge signal-badge--${state}`}>
      <span className="signal-badge__icon" aria-hidden="true">{ICONS[state]}</span>
      <span className="signal-badge__text">
        {label}: <strong>{t(`analysis.states.${state}`)}</strong>
      </span>
    </div>
  );
}

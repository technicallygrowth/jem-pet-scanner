import { useTranslation } from 'react-i18next';
import './BottomNav.css';

const TABS = [
  { key: 'home', icon: '🏠' },
  { key: 'scan', icon: '📷' },
  { key: 'care', icon: '🩺' },
  { key: 'tips', icon: '💡' },
];

export default function BottomNav({ activeTab, onChange }) {
  const { t } = useTranslation();

  return (
    <nav className="bottom-nav" aria-label={t('nav.label')}>
      {TABS.map((tab) => (
        <button
          key={tab.key}
          type="button"
          className={activeTab === tab.key ? 'bottom-nav__item is-active' : 'bottom-nav__item'}
          onClick={() => onChange(tab.key)}
          aria-current={activeTab === tab.key ? 'page' : undefined}
        >
          <span className="bottom-nav__icon" aria-hidden="true">{tab.icon}</span>
          <span className="bottom-nav__label">{t(`nav.${tab.key}`)}</span>
        </button>
      ))}
    </nav>
  );
}

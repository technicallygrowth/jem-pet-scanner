import { useTranslation } from 'react-i18next';
import './LanguageToggle.css';

const LANGUAGES = ['en', 'es'];

export default function LanguageToggle() {
  const { t, i18n } = useTranslation();
  const current = i18n.resolvedLanguage;

  return (
    <div className="language-toggle" role="group" aria-label={t('language.label')}>
      {LANGUAGES.map((lng) => (
        <button
          key={lng}
          type="button"
          className={lng === current ? 'language-toggle__option is-active' : 'language-toggle__option'}
          aria-pressed={lng === current}
          onClick={() => i18n.changeLanguage(lng)}
        >
          {t(`language.${lng}`)}
        </button>
      ))}
    </div>
  );
}

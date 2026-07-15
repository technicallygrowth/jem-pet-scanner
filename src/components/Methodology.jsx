import { useTranslation } from 'react-i18next';
import './Methodology.css';

export default function Methodology({ onBack }) {
  const { t } = useTranslation();

  return (
    <div className="methodology">
      <button type="button" className="methodology__back" onClick={onBack}>
        {t('methodology.backButton')}
      </button>

      <h2 className="methodology__title">{t('methodology.title')}</h2>

      <section className="methodology__section">
        <h3>{t('methodology.philosophyTitle')}</h3>
        <p>{t('methodology.philosophyBody')}</p>
      </section>

      <section className="methodology__section">
        <h3>{t('methodology.layer1Title')}</h3>
        <p>{t('methodology.layer1Body')}</p>
      </section>

      <section className="methodology__section">
        <h3>{t('methodology.layer2Title')}</h3>
        <p>{t('methodology.layer2Body')}</p>
      </section>

      <section className="methodology__section">
        <h3>{t('methodology.layer3Title')}</h3>
        <p>{t('methodology.layer3Body')}</p>
      </section>

      <section className="methodology__section">
        <h3>{t('methodology.dataSourcesTitle')}</h3>
        <p>{t('methodology.dataSourcesBody')}</p>
      </section>

      <section className="methodology__section methodology__section--flagged">
        <h3>{t('methodology.verificationTitle')}</h3>
        <p>{t('methodology.verificationBody')}</p>
      </section>

      <section className="methodology__section methodology__section--disclaimer">
        <h3>{t('methodology.disclaimerTitle')}</h3>
        <p>{t('methodology.disclaimerBody')}</p>
      </section>

      <button type="button" className="scanner__secondary-button" onClick={onBack}>
        {t('methodology.backButton')}
      </button>
    </div>
  );
}

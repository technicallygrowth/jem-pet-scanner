import { useTranslation } from 'react-i18next';
import tipsData from '../data/generalTips.json';
import './CommonBeliefs.css';
import './TipsTab.css';

export default function TipsTab({ onShowMethodology }) {
  const { t, i18n } = useTranslation();
  const lang = i18n.resolvedLanguage === 'es' ? 'es' : 'en';

  return (
    <div className="tips-tab">
      <h2 className="tips-tab__title">{t('tips.title')}</h2>

      <section className="tips-tab__section">
        <h3 className="tips-tab__section-title">{t('tips.mythsTitle')}</h3>
        <div className="tips-tab__cards">
          {tipsData.myths.map((item) => (
            <div key={item.id} className="beliefs__card">
              <p className="beliefs__belief">
                <span className="beliefs__belief-label">{t('analysis.beliefLabel')}</span>
                {item.belief[lang]}
              </p>
              <p className="beliefs__evidence">
                <span className="beliefs__evidence-label">{t('analysis.evidenceLabel')}</span>
                {item.evidence[lang]}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="tips-tab__section">
        <h3 className="tips-tab__section-title">{t('tips.tipsTitle')}</h3>
        <div className="tips-tab__cards">
          {tipsData.tips.map((item) => (
            <div key={item.id} className="tips-tab__tip-card">
              <h4>{item.title[lang]}</h4>
              <p>{item.body[lang]}</p>
            </div>
          ))}
        </div>
      </section>

      <button type="button" className="tips-tab__methodology-link" onClick={onShowMethodology}>
        {t('dashboard.methodologyLink')} →
      </button>
    </div>
  );
}

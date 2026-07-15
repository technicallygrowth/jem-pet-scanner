import { useTranslation } from 'react-i18next';
import beliefsData from '../data/commonBeliefs.json';
import './CommonBeliefs.css';

// Layer 3 of the analysis (docs/rubrica-v1-y-datos.md section 1, Capa 3).
// Golden rule enforced by the markup itself: the belief renders as a muted
// quote, the evidence renders as the primary, higher-contrast text right
// below it — evidence first in visual weight, belief framed as "what people
// think", never the other way around.
export default function CommonBeliefs() {
  const { t, i18n } = useTranslation();
  const lang = i18n.resolvedLanguage === 'es' ? 'es' : 'en';

  return (
    <section className="analysis__layer">
      <h3 className="analysis__layer-title">{t('analysis.layer3Title')}</h3>
      <p className="beliefs__intro">{t('analysis.layer3Intro')}</p>
      <div className="beliefs__list">
        {beliefsData.beliefs.map((item) => (
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
  );
}

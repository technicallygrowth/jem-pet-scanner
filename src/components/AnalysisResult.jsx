import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { lookupProductByBarcode } from '../services/openPetFoodFacts';
import { matchBrand } from '../utils/matchBrand';
import { detectArtificialAdditives } from '../utils/detectSignals';
import SignalBadge from './SignalBadge';
import LabelCapture from './LabelCapture';
import PetAvatar from './PetAvatar';
import './AnalysisResult.css';

export default function AnalysisResult({ barcode, pet, onScanAgain }) {
  const { t, i18n } = useTranslation();
  const lang = i18n.resolvedLanguage === 'es' ? 'es' : 'en';
  const [state, setState] = useState('loading'); // loading | not-found | brand-unknown | analyzed | capture | captured
  const [product, setProduct] = useState(null);
  const [brand, setBrand] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setState('loading');
    lookupProductByBarcode(barcode).then((result) => {
      if (cancelled) return;
      setProduct(result);
      if (!result.found) {
        setState('not-found');
        return;
      }
      const matchedBrand = matchBrand(result);
      setBrand(matchedBrand);
      setState(matchedBrand ? 'analyzed' : 'brand-unknown');
    });
    return () => {
      cancelled = true;
    };
  }, [barcode]);

  if (state === 'loading') {
    return <p className="analysis__hint">{t('analysis.loading')}</p>;
  }

  if (state === 'capture') {
    return (
      <LabelCapture
        barcode={barcode}
        onCancel={() => setState(product?.found ? 'brand-unknown' : 'not-found')}
        onSubmitted={() => setState('captured')}
      />
    );
  }

  if (state === 'captured') {
    return (
      <div className="analysis__empty">
        <h2>{t('capture.thanksTitle')}</h2>
        <p>{t('capture.thanksBody')}</p>
        <p className="analysis__illustrative-banner">{t('capture.pilotNote')}</p>
        <button type="button" className="scanner__primary-button" onClick={onScanAgain}>
          {t('scanner.scanAgainButton')}
        </button>
      </div>
    );
  }

  if (state === 'not-found') {
    return (
      <div className="analysis__empty">
        <h2>{t('analysis.productNotFoundTitle')}</h2>
        <p>{t('analysis.productNotFoundBody')}</p>
        <p className="analysis__barcode">{barcode}</p>
        <button type="button" className="scanner__primary-button" onClick={() => setState('capture')}>
          {t('capture.helpAddButton')}
        </button>
        <button type="button" className="scanner__secondary-button" onClick={onScanAgain}>
          {t('scanner.scanAgainButton')}
        </button>
      </div>
    );
  }

  if (state === 'brand-unknown') {
    return (
      <div className="analysis__empty">
        <h2>{t('analysis.brandNotFoundTitle')}</h2>
        <p>{t('analysis.brandNotFoundBody')}</p>
        {product?.productName && <p className="analysis__product-name">{product.productName}</p>}
        <p className="analysis__barcode">{barcode}</p>
        <button type="button" className="scanner__primary-button" onClick={() => setState('capture')}>
          {t('capture.helpAddButton')}
        </button>
        <button type="button" className="scanner__secondary-button" onClick={onScanAgain}>
          {t('scanner.scanAgainButton')}
        </button>
      </div>
    );
  }

  // state === 'analyzed'
  const dyesState = detectArtificialAdditives(product.ingredientsText);
  const wsavaState = brand.wsava.overall === 'unevaluated' ? 'missing' : brand.wsava.overall;
  const feedingTrialsState = brand.wsava.allFiveCriteriaMet === true ? 'met' : 'missing';
  const speciesCovered = !pet || brand.species.includes(pet.species);
  const completeBalancedLabel = pet
    ? t('analysis.signals.completeBalancedFor', { stage: t(`profile.${pet.lifeStage}`).toLowerCase() })
    : t('analysis.signals.completeBalanced');

  return (
    <div className="analysis">
      {pet && (
        <div className="analysis__pet-context">
          <PetAvatar species={pet.species} size={44} />
          <span>{t('analysis.forPet', { name: pet.name })}</span>
        </div>
      )}

      <div className="analysis__header">
        {product.imageUrl && <img src={product.imageUrl} alt="" className="analysis__product-image" />}
        <div>
          <h2 className="analysis__brand-name">{brand.name}</h2>
          {product.productName && <p className="analysis__product-name">{product.productName}</p>}
        </div>
      </div>

      <p className="analysis__illustrative-banner">{t('analysis.illustrative')}</p>

      {!speciesCovered && (
        <p className="analysis__species-caveat">
          {t('analysis.speciesNotCovered', {
            brand: brand.name,
            species: t(`profile.${pet.species}Lower`),
          })}
        </p>
      )}

      <section className="analysis__layer">
        <h3 className="analysis__layer-title">{t('analysis.layer1Title')}</h3>
        <div className="analysis__badges">
          <SignalBadge label={completeBalancedLabel} state="missing" />
          <SignalBadge label={t('analysis.signals.wsava')} state={wsavaState} />
          <SignalBadge label={t('analysis.signals.feedingTrials')} state={feedingTrialsState} />
          <SignalBadge label={t('analysis.signals.dyes')} state={dyesState} />
          <SignalBadge label={t('analysis.signals.recalls')} state="missing" />
        </div>
      </section>

      <section className="analysis__layer">
        <h3 className="analysis__layer-title">{t('analysis.layer2Title')}</h3>
        <p className="analysis__evidence-text">{brand.evidence[lang]}</p>
      </section>

      <button type="button" className="scanner__primary-button" onClick={onScanAgain}>
        {t('scanner.scanAgainButton')}
      </button>
    </div>
  );
}

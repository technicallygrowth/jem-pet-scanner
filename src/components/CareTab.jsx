import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CARE_CATEGORIES } from '../data/careCategories';
import { useCareRecords } from '../hooks/useCareRecords';
import { formatElapsedDays } from '../utils/formatElapsed';
import './CareTab.css';

export default function CareTab({ activePet: pet }) {
  const { t } = useTranslation();
  const { records, updateCategory } = useCareRecords(pet.id);
  const [expandedKey, setExpandedKey] = useState(null);

  function toggleExpanded(key) {
    setExpandedKey((current) => (current === key ? null : key));
  }

  return (
    <div className="care-tab">
      <h2 className="care-tab__title">{t('care.title', { name: pet.name })}</h2>
      <p className="care-tab__intro">{t('care.intro')}</p>

      <div className="care-tab__list">
        {CARE_CATEGORIES.map((category) => {
          const record = records[category.key] ?? {};
          const isExpanded = expandedKey === category.key;
          const isNeutered = category.hasNeuteredToggle && record.neutered;

          return (
            <div key={category.key} className="care-tab__item">
              <button
                type="button"
                className="care-tab__item-header"
                onClick={() => toggleExpanded(category.key)}
                aria-expanded={isExpanded}
              >
                <span className="care-tab__item-icon" aria-hidden="true">{category.icon}</span>
                <span className="care-tab__item-label">{t(`care.categories.${category.key}`)}</span>
                <span className="care-tab__item-summary">
                  {isNeutered ? t('care.neuteredYesNote') : formatElapsedDays(record.lastDate, t)}
                </span>
                <span className={`care-tab__chevron ${isExpanded ? 'is-open' : ''}`} aria-hidden="true">▾</span>
              </button>

              {isExpanded && (
                <div className="care-tab__item-body">
                  {category.hasNeuteredToggle && (
                    <label className="care-tab__checkbox-row">
                      <input
                        type="checkbox"
                        checked={!!record.neutered}
                        onChange={(e) => updateCategory(category.key, { neutered: e.target.checked })}
                      />
                      {t('care.neuteredLabel')}
                    </label>
                  )}

                  {!isNeutered && (
                    <label className="care-tab__date-row">
                      <span>{t('care.lastDateLabel')}</span>
                      <input
                        type="date"
                        value={record.lastDate ?? ''}
                        max={new Date().toISOString().slice(0, 10)}
                        onChange={(e) => updateCategory(category.key, { lastDate: e.target.value })}
                      />
                    </label>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <p className="care-tab__disclaimer">{t('care.disclaimer')}</p>
    </div>
  );
}

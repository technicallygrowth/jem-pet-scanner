import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { searchBrands } from '../utils/searchBrands';
import './BrandSearch.css';

export default function BrandSearch({ onSelectBrand }) {
  const { t } = useTranslation();
  const [query, setQuery] = useState('');
  const results = query.trim() ? searchBrands(query).slice(0, 6) : [];

  function selectBrand(brand) {
    onSelectBrand(brand);
    setQuery('');
  }

  return (
    <div className="brand-search">
      <input
        type="text"
        className="brand-search__input"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={t('search.placeholder')}
      />
      {results.length > 0 && (
        <ul className="brand-search__results">
          {results.map((brand) => (
            <li key={brand.id}>
              <button type="button" className="brand-search__result" onClick={() => selectBrand(brand)}>
                {brand.name}
              </button>
            </li>
          ))}
        </ul>
      )}
      {query.trim() && results.length === 0 && (
        <p className="brand-search__empty">{t('search.noResults')}</p>
      )}
    </div>
  );
}

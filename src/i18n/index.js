import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import en from './locales/en/translation.json';
import es from './locales/es/translation.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      es: { translation: es },
    },
    fallbackLng: 'en',
    supportedLngs: ['en', 'es'],
    interpolation: { escapeValue: false },
    detection: {
      // Checks a manual toggle first, then the browser language, then falls
      // back to English (the primary US market default from the brief).
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'jem-pet-language',
    },
  });

export default i18n;

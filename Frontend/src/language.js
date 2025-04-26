import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import your language files
import en from '../src/locales/en/translation.json';
import hi from '../src/locales/hi/translation.json';
import bn from './locales/bn.json';
import te from './locales/te.json';
import mr from './locales/mr.json';
import ta from './locales/ta.json';
import ur from './locales/ur.json';
import gu from './locales/gu.json';
import ml from './locales/ml.json';
import kn from './locales/kn.json';
import pa from './locales/pa.json';
import or from './locales/or.json';
import as from './locales/as.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      hi: { translation: hi },
      bn: { translation: bn },
      te: { translation: te },
      mr: { translation: mr },
      ta: { translation: ta },
      ur: { translation: ur },
      gu: { translation: gu },
      ml: { translation: ml },
      kn: { translation: kn },
      pa: { translation: pa },
      or: { translation: or },
      as: { translation: as },
    },
    fallbackLng: 'en', // fallback language if the user's language is not available
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;

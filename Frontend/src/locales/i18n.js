// src/i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import translationEN from './en/translation.json';
import translationHI from './hi/translation.json';

// Language files
const resources = {
  en: { translation: translationEN },
  hi: { translation: translationHI },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: sessionStorage.getItem('language') || 'en', // default
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
  });

export default i18n;

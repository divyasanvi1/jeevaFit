// src/i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import translationEN from './en/translation.json';
import translationHI from './hi/translation.json';

const savedLanguage = localStorage.getItem('language') || 'en';
// Language files
const resources = {
  en: { translation: translationEN },
  hi: { translation: translationHI },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: savedLanguage, // default
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
  });

export default i18n;

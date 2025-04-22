import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import i18next from 'i18next';
import { I18nextProvider } from 'react-i18next';
import App from './App.jsx'
import enTranslation from '../public/locales/en/translation.json';
import hiTranslation from '../public/locales/hi/translation.json';
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/service-worker.js')  // Path to your service worker file
      .then((registration) => {
        console.log('Service Worker registered with scope:', registration.scope);
      })
      .catch((error) => {
        console.log('Service Worker registration failed:', error);
      });
  });
}
i18next.init({
  lng: 'en',  // Default language
  fallbackLng: 'en',  // Fallback language if translation is missing
  resources: {
    en: {
      translation: enTranslation,
    },
    hi: {
      translation: hiTranslation,
    },
    // Add other languages as needed
  },
  interpolation: {
    escapeValue: false,  // React escapes by default
  },
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <I18nextProvider i18n={i18next}> 
    <App />
    </I18nextProvider>
  </StrictMode>,
)

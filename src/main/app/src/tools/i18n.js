import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import XHR from 'i18next-xhr-backend';

i18n
  .use(LanguageDetector)
  .use(XHR)
  .init({
    fallbackLng: ['fi'],
    whitelist: ['fi', 'sv', 'en'],
    debug: process.env.NODE_ENV === 'development',
    // saveMissing: process.env.NODE_ENV === 'development',
    // saveMissingTo: 'all',
    load: 'languageOnly',
    interpolation: {
      escapeValue: false,
    },
    react: {
      wait: true,
      bindI18n: 'languageChanged loaded',
      bindStore: 'added removed',
      nsMode: 'default',
    },
    backend: {
      loadPath: '/konfo/locales/{{lng}}/{{ns}}.json',
    },
  });

export default i18n;

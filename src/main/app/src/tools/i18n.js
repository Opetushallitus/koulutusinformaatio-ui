import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';
import ls from 'local-storage';

const lng = ls.get('lang');

i18n
  .use(Backend)
  .use(initReactI18next)
  .init({
    lng: lng || 'fi',
    fallbackLng: ['fi'],
    supportedLngs: ['fi', 'sv', 'en'],
    debug: process.env.NODE_ENV === 'development',
    load: 'languageOnly',
    interpolation: {
      escapeValue: false,
    },
    backend: {
      loadPath:
        process.env.NODE_ENV === 'development'
          ? '/konfo/locales/{{lng}}/{{ns}}.json'
          : '/konfo-backend/translation/{{lng}}',
      customHeaders: {
        'Caller-Id': '1.2.246.562.10.00000000001.konfoui',
      },
    },
  });

i18n.on('languageChanged', async (lng) => {
  ls.set('lang', lng);
});

export default i18n;

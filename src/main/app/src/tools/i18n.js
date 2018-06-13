import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import XHR from 'i18next-xhr-backend';

i18n
    .use(LanguageDetector)
    .use(XHR)
    .init({
        fallbackLng: ['fi'],
        preload: ['fi'],
        debug: process.env.NODE_ENV === 'development',
        // saveMissing: process.env.NODE_ENV === 'development',
        // saveMissingTo: 'all',
        load: 'languageOnly',
        interpolation: {
            escapeValue: false
        },
        react: {
            wait: true,
            bindI18n: 'languageChanged loaded',
            bindStore: 'added removed',
            nsMode: 'default'
        }
    });

export default i18n;
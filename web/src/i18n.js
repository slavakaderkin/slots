import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import resources from './locales';
const telegram = window.Telegram.WebApp;
const { language_code } = telegram.initDataUnsafe?.user || {};


const DEFAULT_LANGUAGE = 'ru';
const i18nInstance = i18n.createInstance();
const languages = Object.keys(resources);
const lng = language_code && languages.includes(language_code)
  ? language_code
  : DEFAULT_LANGUAGE;

i18nInstance
  .use(initReactI18next)
  .init({
    lng,
    debug: false, //true,
    resources,
    interpolation: {
      escapeValue: false,
    },
  });

export default i18nInstance;
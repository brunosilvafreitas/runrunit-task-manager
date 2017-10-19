import en from './en.json';
import pt from './pt.json';

const browserLanguage = (navigator.language || navigator.userLanguage || 'en').split('-')[0];
const currentLanguage = localStorage.getItem("language") || browserLanguage;

const locales = {
  en: {
    locale: 'en-us',
    messages: en
  },
  pt: {
    locale: 'pt-br',
    messages: pt
  }
};

export default () => locales[
  Object.keys(locales).includes(currentLanguage) ? currentLanguage : 'en'
];
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import mapValues from 'lodash/mapValues';
import pickBy from 'lodash/pickBy';

function filterEmptyStrings(obj) {
  return mapValues(
    pickBy(obj, (value) => value !== ''),
    (value) => {
      if (typeof value === 'object' && value != null) {
        return filterEmptyStrings(value);
      }

      return value;
    },
  );
}

const PromiseI18nextBackend = {
  type: 'backend',
  init(services, backendOptions) {
    this.loaders = backendOptions.loaders || {};
  },
  read(language, namespace, callback) {
    const loader = this.loaders[language][namespace];

    if (!loader) {
      callback(`Unknown language '${language}'`, null);
    }

    loader()
      .then((resources) => callback(null, filterEmptyStrings(resources)))
      .catch((error) => callback(error, null));
  },
};

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .use(PromiseI18nextBackend)
  .init({
    backend: {
      loaders: {
        en: {
          translation: () => import('../../locales/en.json').then((module) => module.default),
        },
        es: {
          translation: () => import('../../locales/es.json').then((module) => module.default),
        },
      },
    },
    lng: 'en',
    fallbackLng: 'en',
    keySeparator: '.',
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n;

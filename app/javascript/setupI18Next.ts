import i18next, { BackendModule, ResourceKey } from 'i18next';
import { initReactI18next } from 'react-i18next';
import mapValues from 'lodash/mapValues';
import pickBy from 'lodash/pickBy';

function filterEmptyStrings(obj: ResourceKey): ResourceKey {
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

type PromiseI18NextBackendOptions = {
  loaders: {
    [language: string]: {
      [namespace: string]: Promise<ResourceKey>,
    },
  },
};

const PromiseI18nextBackend: BackendModule = {
  type: 'backend',
  init(services, backendOptions: PromiseI18NextBackendOptions) {
    this.loaders = backendOptions.loaders || {};
  },
  read(language, namespace, callback) {
    const loader = this.loaders[language][namespace];

    if (!loader) {
      callback(new Error(`Unknown language '${language}'`), false);
    }

    loader()
      .then((resources: ResourceKey) => callback(null, filterEmptyStrings(resources)))
      .catch((error: Error) => callback(error, false));
  },
  create() {
    // can't actually save anything
  },
};

i18next
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

export default i18next;

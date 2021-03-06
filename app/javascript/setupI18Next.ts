import i18next, { BackendModule, ResourceKey } from 'i18next';
import { initReactI18next } from 'react-i18next';
import mapValues from 'lodash/mapValues';
import pickBy from 'lodash/pickBy';
import enLanguage from '../../locales/en.json'; // english is the fallback language and therefore must always be loaded

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
      [namespace: string]: Promise<ResourceKey>;
    };
  };
};

type PromiseI18NextBackendModule = BackendModule<PromiseI18NextBackendOptions> & {
  loaders: PromiseI18NextBackendOptions['loaders'];
};

const PromiseI18nextBackend: PromiseI18NextBackendModule = {
  type: 'backend',
  loaders: {},
  init(services, backendOptions) {
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

const initOptions = {
  backend: {
    loaders: {
      en: {
        translation: async () => enLanguage,
      },
      es: {
        translation: () => import('../../locales/es.json').then((module) => module.default),
      },
    },
  },
  defaultNS: 'translation',
  lng: 'en',
  fallbackLng: 'en',
  keySeparator: '.',
  interpolation: {
    escapeValue: false, // react already safes from xss
  },
};

let ready = false;
const i18n = i18next
  .use(initReactI18next) // passes i18n down to react-i18next
  .use(PromiseI18nextBackend);

const i18nInitPromise = i18n.init(initOptions).then(() => {
  ready = true;
});

async function getI18n() {
  if (ready) {
    return i18n;
  }

  await i18nInitPromise;
  return i18n;
}

export { i18n };
export default getI18n;

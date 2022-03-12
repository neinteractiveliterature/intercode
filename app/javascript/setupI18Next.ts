import i18next, { BackendModule, i18n, InitOptions, ResourceKey } from 'i18next';
import { DateTime } from 'luxon';
import { initReactI18next } from 'react-i18next';
import { DateTimeFormatKey } from './DateTimeFormats';
import formatMoney from './formatMoney';
import { Money } from './graphqlTypes.generated';
import { formatLCM } from './TimeUtils';

function filterEmptyStrings(obj: Exclude<ResourceKey, string>): ResourceKey {
  return Object.fromEntries(
    Object.entries(obj)
      .filter(([, value]) => value !== '')
      .map(([key, value]) => {
        if (typeof value === 'object' && value != null) {
          return [key, filterEmptyStrings(value)];
        }

        return [key, value];
      }),
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
      .then((resources: Exclude<ResourceKey, string>) => callback(null, filterEmptyStrings(resources)))
      .catch((error: Error) => callback(error, false));
  },
  create() {
    // can't actually save anything
  },
};

const initOptions: InitOptions = {
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
  defaultNS: 'translation',
  lng: 'en',
  fallbackLng: 'en',
  keySeparator: '.',
  interpolation: {
    escapeValue: false, // react already safes from xss
  },
};

let ready = false;
const i18nObject = i18next
  .use(initReactI18next) // passes i18n down to react-i18next
  .use(PromiseI18nextBackend);

const i18nInitPromise = i18nObject.init(initOptions).then(() => {
  i18nObject.services.formatter?.add('money', (value: Money | null | undefined) => formatMoney(value));
  i18nObject.services.formatter?.add(
    'datetimenamed',
    (value: DateTime, lng: string, options: { format: DateTimeFormatKey }) =>
      formatLCM(value, i18nObject.t(`dateTimeFormats.${options.format}`, { lng })),
  );
  i18nObject.services.formatter?.add('capitalize', (value: string) =>
    value === '' ? '' : `${value[0].toUpperCase()}${value.slice(1).toLowerCase()}`,
  );
  ready = true;
});

async function getI18n(): Promise<i18n> {
  if (ready) {
    return i18nObject;
  }

  await i18nInitPromise;
  return i18nObject;
}

export { i18nObject as i18n };
export default getI18n;

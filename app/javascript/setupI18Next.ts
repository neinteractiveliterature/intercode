import i18next, { BackendModule, i18n, InitOptions, ResourceKey } from 'i18next';
import ChainedBackend, { ChainedBackendOptions } from 'i18next-chained-backend';
import LocalStorageBackend from 'i18next-localstorage-backend';
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

// https://gist.github.com/SimeonC/6a738467c691eef7f21ebf96918cd95f
// Used for not namespacing, ie `defaultNamespace: 'translations'`
const CodeSplitLoaderBackend: BackendModule<Record<string, never>> = {
  type: 'backend',
  init() {},
  read(language, namespace, callback) {
    import(`../../locales/${language}.json`)
      .then((resources) => {
        callback(null, filterEmptyStrings(resources));
      })
      .catch((error) => {
        callback(error, null);
      });
  },
};

const localesVersion = typeof __webpack_hash__ === 'undefined' ? '' : __webpack_hash__;

const initOptions: InitOptions<ChainedBackendOptions> = {
  backend: {
    backends: [LocalStorageBackend, CodeSplitLoaderBackend],
    backendOptions: [
      {
        // 1 day
        expirationTime: 24 * 60 * 60 * 1000,
        versions: {
          en: localesVersion,
          es: localesVersion,
        },
      },
      {},
    ],
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
  .use(ChainedBackend);

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

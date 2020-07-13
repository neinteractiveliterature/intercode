/* eslint-disable import/first */
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import './tempPolyfills';
import '@testing-library/jest-dom/extend-expect';

import englishTranslations from '../../locales/en.json';

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources: {
      en: {
        translations: englishTranslations,
      },
    },
    lng: 'dev',
    fallbackLng: 'dev',
    keySeparator: '.',
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

jest.setTimeout(10000);

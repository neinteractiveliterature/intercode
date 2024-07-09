import 'react-i18next';
import en from '../../../locales/en.json';

declare module 'i18next' {
  interface CustomTypeOptions {
    allowObjectInHTMLChildren: true;
    returnNull: false;
    resources: { translation: typeof en };
  }
}

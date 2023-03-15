import 'react-i18next';

declare module 'i18next' {
  interface CustomTypeOptions {
    allowObjectInHTMLChildren: true;
    returnNull: false;
  }
}

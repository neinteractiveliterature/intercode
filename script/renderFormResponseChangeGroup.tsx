#!/usr/bin/env node

import 'regenerator-runtime/runtime';

import ReactDOMServer from 'react-dom/server';
import SourceMapSupport from 'source-map-support';

import { I18nextProvider } from 'react-i18next';
import FormItemChangeGroup from '../app/javascript/FormPresenter/ItemChangeDisplays/FormItemChangeGroup';
import AppRootContext, { appRootContextDefaultValue } from '../app/javascript/AppRootContext';
import { timezoneNameForConvention } from '../app/javascript/TimeUtils';
import getI18n from '../app/javascript/setupI18Next';

SourceMapSupport.install();

const props = JSON.parse(process.argv[2]);
async function render() {
  const i18n = await getI18n();

  ReactDOMServer.renderToStaticNodeStream(
    <AppRootContext.Provider
      value={{
        ...appRootContextDefaultValue,
        language: props.convention.language,
        timezoneName: timezoneNameForConvention(props.convention),
      }}
    >
      <I18nextProvider i18n={i18n}>
        <FormItemChangeGroup {...props} />
      </I18nextProvider>
    </AppRootContext.Provider>,
  ).pipe(process.stdout);
}

render();

#!/usr/bin/env node

import 'regenerator-runtime/runtime';

import ReactDOMServer from 'react-dom/server';
import { Settings } from 'luxon';
import SourceMapSupport from 'source-map-support';

import { I18nextProvider } from 'react-i18next';
import FormItemChangeGroup from '../app/javascript/FormPresenter/ItemChangeDisplays/FormItemChangeGroup';
import AppRootContext, { appRootContextDefaultValue } from '../app/javascript/AppRootContext';
import { timezoneNameForConvention } from '../app/javascript/TimeUtils';
import getI18n from '../app/javascript/setupI18Next';
import { stdout } from 'process';

SourceMapSupport.install();

const props = JSON.parse(process.argv[2]);
async function render() {
  const i18n = await getI18n();
  await i18n.changeLanguage(props.convention.language);
  const timezoneName = timezoneNameForConvention(props.convention);
  // The change timestamps are formatted in the default zone, which is otherwise the server's
  Settings.defaultZone = timezoneName;

  const stream = ReactDOMServer.renderToPipeableStream(
    <AppRootContext.Provider
      value={{
        ...appRootContextDefaultValue,
        language: props.convention.language,
        timezoneName,
      }}
    >
      <I18nextProvider i18n={i18n}>
        <FormItemChangeGroup {...props} />
      </I18nextProvider>
    </AppRootContext.Provider>,
    {
      onAllReady: () => {
        stream.pipe(stdout);
      },
    },
  );
}

render();

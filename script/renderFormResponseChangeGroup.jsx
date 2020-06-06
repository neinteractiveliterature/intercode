import React from 'react';
import ReactDOMServer from 'react-dom/server';
import SourceMapSupport from 'source-map-support';

import FormItemChangeGroup from '../app/javascript/FormPresenter/ItemChangeDisplays/FormItemChangeGroup';
import AppRootContext from '../app/javascript/AppRootContext';
import { timezoneNameForConvention } from '../app/javascript/TimeUtils';

SourceMapSupport.install();

const props = JSON.parse(process.argv[2]);

ReactDOMServer.renderToStaticNodeStream(
  <AppRootContext.Provider
    value={{ timezoneName: timezoneNameForConvention(props.convention) }}
  >
    <FormItemChangeGroup {...props} />
  </AppRootContext.Provider>,
).pipe(process.stdout);

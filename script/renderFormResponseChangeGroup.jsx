import React from 'react';
import ReactDOMServer from 'react-dom/server';
import SourceMapSupport from 'source-map-support';

import FormItemChangeGroup from '../app/javascript/FormPresenter/ItemChangeDisplays/FormItemChangeGroup';
import AppRootContext from '../app/javascript/AppRootContext';

SourceMapSupport.install();

const props = JSON.parse(process.argv[2]);

ReactDOMServer.renderToStaticNodeStream(
  <AppRootContext.Provider value={{ timezoneName: props.convention.timezone_name }}>
    <FormItemChangeGroup {...props} />
  </AppRootContext.Provider>,
).pipe(process.stdout);

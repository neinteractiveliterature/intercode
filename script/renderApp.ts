import { createElement } from 'react';
import { renderToString } from 'react-dom/server';

import ssrPrepass from 'react-ssr-prepass';
import components from '../app/javascript/packs/components';

const renderApp = async () => {
  const element = createElement(components.AppRoot);
  await ssrPrepass(element);

  return renderToString(element);
};

renderApp().then((result) => console.log(result));

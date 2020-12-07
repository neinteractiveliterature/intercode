import { ElementType } from 'react';
import { renderToString } from 'react-dom/server';

import ssrPrepass from 'react-ssr-prepass';
import Components from '../app/javascript/packs/components';

const request = {
  header: () => undefined,
};

export default async function renderApp() {
  const element = <Components.AppRoot staticLocation="/" ssrRequest={request} />;
  await ssrPrepass(element, (element: JSX.Element, instance) => {
    console.log(element.type);
  });

  return renderToString(element);
}

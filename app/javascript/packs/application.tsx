import 'regenerator-runtime/runtime';

import components from './components';
import mountReactComponents from '../mountReactComponents';
import { hydrateRoot } from 'react-dom/client';

const ssrHydratePropsJSON = document.body.getAttribute('data-intercode-ssr-hydrate');

if (ssrHydratePropsJSON) {
  const ssrHydrateProps = JSON.parse(ssrHydratePropsJSON);
  import('../BrowserAppShell').then(({ default: BrowserAppShell }) => {
    hydrateRoot(document, <BrowserAppShell appRootContent={ssrHydrateProps.appRootContent} />);
  });
} else {
  mountReactComponents(components);
}

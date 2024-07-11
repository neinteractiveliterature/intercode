import 'regenerator-runtime/runtime';

import components from './components';
import mountReactComponents from '../mountReactComponents';
import { hydrateRoot } from 'react-dom/client';

const ssrHydratePropsJSON = document.body.getAttribute('data-intercode-ssr-hydrate');

if (ssrHydratePropsJSON) {
  const ssrHydrateProps = JSON.parse(ssrHydratePropsJSON);
  import('../AppShellContent').then(({ default: AppShellContent }) => {
    hydrateRoot(document, <AppShellContent appRootContent={ssrHydrateProps.appRootContent} />);
  });
} else {
  mountReactComponents(components);
}
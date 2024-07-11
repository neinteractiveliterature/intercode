import 'regenerator-runtime/runtime';

import components from './components';
import mountReactComponents from '../mountReactComponents';
import { hydrateRoot } from 'react-dom/client';

const ssrHydratePropsJSON = document.body.getAttribute('data-intercode-ssr-hydrate');

if (ssrHydratePropsJSON) {
  const ssrHydrateProps = JSON.parse(ssrHydratePropsJSON);
  import('../parsePageContent').then((parsePageContent) => {
    const parseDocument = (html: string) => parsePageContent.default(html, components);
    import('../AppShellContent').then(({ default: AppShellContent }) => {
      hydrateRoot(
        document,
        <AppShellContent appRootContent={ssrHydrateProps.appRootContent} parseDocument={parseDocument} />,
      );
    });
  });
} else {
  mountReactComponents(components);
}

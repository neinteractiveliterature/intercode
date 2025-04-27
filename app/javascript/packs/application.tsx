import 'regenerator-runtime/runtime';

import mountReactComponents from '../mountReactComponents';
import { StrictMode, useMemo } from 'react';
import AuthenticityTokensManager, {
  AuthenticityTokensContext,
  getAuthenticityTokensURL,
} from 'AuthenticityTokensContext';
import { createBrowserRouter, RouteObject, RouterProvider, unstable_InitialContext } from 'react-router';
import routes from 'routes';
import { ProviderStack } from 'AppWrapper';
import { buildBrowserApolloClient } from 'useIntercodeApolloClient';
import { ApolloProvider } from '@apollo/client';
import {
  apolloClientContext,
  authenticityTokensManagerContext,
  clientConfigurationDataContext,
  fetchContext,
  sessionContext,
} from 'AppContexts';
import { ClientConfigurationQueryData } from 'serverQueries.generated';

const manager = new AuthenticityTokensManager(fetch, undefined, getAuthenticityTokensURL());

export type LibraryModeApplicationEntryProps = {
  recaptchaSiteKey: string;
  railsDefaultActiveStorageServiceName: string;
  railsDirectUploadsURL: string;
};

function LibraryModeApplicationEntry({
  recaptchaSiteKey,
  railsDefaultActiveStorageServiceName,
  railsDirectUploadsURL,
}: LibraryModeApplicationEntryProps) {
  const client = useMemo(() => buildBrowserApolloClient(manager), []);

  const clientConfigurationData = useMemo<ClientConfigurationQueryData>(
    () => ({
      __typename: 'Query',
      clientConfiguration: {
        __typename: 'ClientConfiguration',
        recaptcha_site_key: recaptchaSiteKey,
        rails_default_active_storage_service_name: railsDefaultActiveStorageServiceName,
        rails_direct_uploads_url: railsDirectUploadsURL,
      },
    }),
    [recaptchaSiteKey, railsDefaultActiveStorageServiceName, railsDirectUploadsURL],
  );

  const router = useMemo(
    () =>
      createBrowserRouter(
        [
          {
            Component: ProviderStack,
            children: [routes as RouteObject],
          },
        ],
        {
          unstable_getContext: () => {
            const map: unstable_InitialContext = new Map();
            map.set(apolloClientContext, client);
            map.set(fetchContext, fetch);
            map.set(authenticityTokensManagerContext, manager);
            map.set(clientConfigurationDataContext, clientConfigurationData);
            map.set(sessionContext, undefined);
            return map;
          },
        },
      ),
    [],
  );

  return (
    <StrictMode>
      <AuthenticityTokensContext.Provider value={manager}>
        <ApolloProvider client={client}>
          <RouterProvider router={router} />
        </ApolloProvider>
      </AuthenticityTokensContext.Provider>
    </StrictMode>
  );
}

mountReactComponents({ AppRoot: LibraryModeApplicationEntry });

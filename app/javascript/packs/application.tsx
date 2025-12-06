import 'regenerator-runtime/runtime';

import mountReactComponents from '../mountReactComponents';
import { StrictMode, useMemo } from 'react';
import AuthenticityTokensManager, {
  AuthenticityTokensContext,
  getAuthenticityTokensURL,
} from 'AuthenticityTokensContext';
import { createBrowserRouter, RouterContextProvider, RouterProvider } from 'react-router';
import { ProviderStack } from 'AppWrapper';
import { buildBrowserApolloClient } from 'useIntercodeApolloClient';
import {
  apolloClientContext,
  authenticityTokensManagerContext,
  clientConfigurationDataContext,
  fetchContext,
  sessionContext,
} from 'AppContexts';
import { ClientConfigurationQueryData } from 'serverQueries.generated';
import { ApolloProvider } from '@apollo/client/react';
import { appRootRoutes } from 'AppRouter';

const manager = new AuthenticityTokensManager(fetch, undefined, getAuthenticityTokensURL());

export type DataModeApplicationEntryProps = {
  recaptchaSiteKey: string;
  railsDefaultActiveStorageServiceName: string;
  railsDirectUploadsURL: string;
};

function DataModeApplicationEntry({
  recaptchaSiteKey,
  railsDefaultActiveStorageServiceName,
  railsDirectUploadsURL,
}: DataModeApplicationEntryProps) {
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
            children: appRootRoutes,
          },
        ],
        {
          getContext: () => {
            const context = new RouterContextProvider();
            context.set(apolloClientContext, client);
            context.set(fetchContext, fetch);
            context.set(authenticityTokensManagerContext, manager);
            context.set(clientConfigurationDataContext, clientConfigurationData);
            context.set(sessionContext, undefined);
            return context;
          },
        },
      ),
    [client, clientConfigurationData],
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

mountReactComponents({ AppRoot: DataModeApplicationEntry });

import 'regenerator-runtime/runtime';

import mountReactComponents from '../mountReactComponents';
import { StrictMode, use, useMemo } from 'react';
import AuthenticityTokensManager, {
  AuthenticityTokensContext,
  getAuthenticityTokensURL,
} from 'AuthenticityTokensContext';
import { createBrowserRouter, RouterContextProvider, RouterProvider } from 'react-router';
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
const refreshPromise = manager.refresh();

export type DataModeApplicationEntryProps = {
  recaptchaSiteKey: string;
  railsDefaultActiveStorageServiceName: string;
  railsDirectUploadsUrl: string;
};

function DataModeApplicationEntry({
  recaptchaSiteKey,
  railsDefaultActiveStorageServiceName,
  railsDirectUploadsUrl,
}: DataModeApplicationEntryProps) {
  use(refreshPromise);

  const client = useMemo(() => buildBrowserApolloClient(manager), []);

  const clientConfigurationData = useMemo<ClientConfigurationQueryData>(
    () => ({
      __typename: 'Query',
      clientConfiguration: {
        __typename: 'ClientConfiguration',
        recaptcha_site_key: recaptchaSiteKey,
        rails_default_active_storage_service_name: railsDefaultActiveStorageServiceName,
        rails_direct_uploads_url: railsDirectUploadsUrl,
      },
    }),
    [recaptchaSiteKey, railsDefaultActiveStorageServiceName, railsDirectUploadsUrl],
  );

  const router = useMemo(
    () =>
      createBrowserRouter(
        [
          {
            lazy: () => import('root'),
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

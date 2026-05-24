import 'regenerator-runtime/runtime';

import mountReactComponents from '../mountReactComponents';
import { StrictMode, Suspense, use, useMemo } from 'react';
import AuthenticityTokensManager, { getAuthenticityTokensURL } from 'AuthenticityTokensContext';
import { createBrowserRouter, RouterContextProvider, RouterProvider } from 'react-router';
import { buildBrowserApolloClient, GraphQLNotAuthenticatedErrorEvent } from 'useIntercodeApolloClient';
import {
  apolloClientContext,
  authenticityTokensManagerContext,
  clientConfigurationContext,
  fetchContext,
  sessionContext,
  ClientConfiguration,
} from 'AppContexts';
import { appRootRoutes } from 'AppRouter';
import { AuthenticationManager, AuthenticationManagerContext } from '../Authentication/authenticationManager';
import { PageLoadingIndicator } from '@neinteractiveliterature/litform';
import { ApolloClient } from '@apollo/client';

type Bootstrap = {
  clientConfiguration: ClientConfiguration;
  authenticityTokensManager: AuthenticityTokensManager;
  authManager: AuthenticationManager;
  client: ApolloClient;
};

// Fetch /client_configuration *first*, then stand up the auth manager and
// Apollo client using its values. This lets the AuthenticationManager refresh
// expired access tokens on cold boot (which requires the OAuth clientId and
// OIDC issuer URL) without depending on server-rendered HTML.
const bootstrapPromise: Promise<Bootstrap> = (async () => {
  const configResponse = await fetch('/client_configuration', { credentials: 'same-origin' });
  if (!configResponse.ok) {
    throw new Error(`Failed to load /client_configuration (HTTP ${configResponse.status})`);
  }
  const clientConfiguration = (await configResponse.json()) as ClientConfiguration;

  const authenticityTokensManager = new AuthenticityTokensManager(fetch, undefined, getAuthenticityTokensURL());
  await authenticityTokensManager.refresh();

  const authManager = AuthenticationManager.deserializeFromBrowser(
    clientConfiguration.oauth_frontend_application_uid ?? undefined,
  );
  authManager.issuerUrl = clientConfiguration.oidc_issuer_url ?? undefined;

  const client = buildBrowserApolloClient(authenticityTokensManager, authManager);

  window.addEventListener(GraphQLNotAuthenticatedErrorEvent.type, async () => {
    const { redirectUrl } = await authManager.initiateAuthentication(window.location.href);
    window.location.href = redirectUrl.toString();
  });

  return { clientConfiguration, authenticityTokensManager, authManager, client };
})();

function DataModeApplicationEntry() {
  const bootstrap = use(bootstrapPromise);

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
            context.set(apolloClientContext, bootstrap.client);
            context.set(fetchContext, fetch);
            context.set(authenticityTokensManagerContext, bootstrap.authenticityTokensManager);
            context.set(clientConfigurationContext, bootstrap.clientConfiguration);
            context.set(sessionContext, undefined);
            return context;
          },
        },
      ),
    [bootstrap],
  );

  return (
    <StrictMode>
      <AuthenticationManagerContext.Provider value={bootstrap.authManager}>
        <RouterProvider router={router} />
      </AuthenticationManagerContext.Provider>
    </StrictMode>
  );
}

function DataModeApplicationEntrySuspenseWrapper() {
  return (
    <Suspense fallback={<PageLoadingIndicator visible />}>
      <DataModeApplicationEntry />
    </Suspense>
  );
}

mountReactComponents({ AppRoot: DataModeApplicationEntrySuspenseWrapper });

import 'regenerator-runtime/runtime';

import mountReactComponents from '../mountReactComponents';
import { StrictMode, Suspense, use, useEffect, useMemo } from 'react';
import AuthenticityTokensManager, { getAuthenticityTokensURL } from 'AuthenticityTokensContext';
import { createBrowserRouter, RouterContextProvider, RouterProvider } from 'react-router';
import { buildBrowserApolloClient, GraphQLNotAuthenticatedErrorEvent } from 'useIntercodeApolloClient';
import {
  apolloClientContext,
  authenticityTokensManagerContext,
  clientConfigurationDataContext,
  fetchContext,
  sessionContext,
} from 'AppContexts';
import { ClientConfigurationQueryDocument } from 'serverQueries.generated';
import { appRootRoutes } from 'AppRouter';
import { AuthenticationManager, AuthenticationManagerContext } from '../Authentication/authenticationManager';
import { ErrorDisplay, PageLoadingIndicator } from '@neinteractiveliterature/litform';

const manager = new AuthenticityTokensManager(fetch, undefined, getAuthenticityTokensURL());
const refreshPromise = manager.refresh();
const authManager = AuthenticationManager.deserializeFromBrowser();
const client = buildBrowserApolloClient(manager, authManager);

window.addEventListener(GraphQLNotAuthenticatedErrorEvent.type, async () => {
  const { redirectUrl } = await authManager.initiateAuthentication(window.location.href);
  window.location.href = redirectUrl.toString();
});
const clientConfigurationQuery = client.query({ query: ClientConfigurationQueryDocument });

function DataModeApplicationEntry() {
  use(refreshPromise);
  const clientConfiguration = use(clientConfigurationQuery);

  // Set auth manager config from Rails props once available
  useEffect(() => {
    authManager.clientId = clientConfiguration.data?.clientConfiguration.oauth_frontend_application_uid ?? undefined;
    authManager.issuerUrl = clientConfiguration.data?.clientConfiguration.oidc_issuer_url ?? undefined;
  }, [clientConfiguration.data]);

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
            if (clientConfiguration.data) {
              context.set(clientConfigurationDataContext, clientConfiguration.data);
            }
            context.set(sessionContext, undefined);
            return context;
          },
        },
      ),
    [clientConfiguration.data],
  );

  return (
    <StrictMode>
      <AuthenticationManagerContext.Provider value={authManager}>
        {clientConfiguration.error ? (
          <ErrorDisplay graphQLError={clientConfiguration.error} />
        ) : (
          <RouterProvider router={router} />
        )}
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

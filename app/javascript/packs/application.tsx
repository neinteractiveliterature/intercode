import 'regenerator-runtime/runtime';

import mountReactComponents from '../mountReactComponents';
import { StrictMode, Suspense, use, useLayoutEffect, useMemo, useState } from 'react';
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
import { initErrorReporting } from 'ErrorReporting';

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
  // /client_configuration is needed to construct the auth manager; the
  // authenticity-tokens refresh is independent and can run in parallel.
  const [configResponse, authenticityTokensManager] = await Promise.all([
    fetch('/client_configuration', { credentials: 'same-origin' }),
    (async () => {
      const mgr = new AuthenticityTokensManager(fetch, undefined, getAuthenticityTokensURL());
      await mgr.refresh();
      return mgr;
    })(),
  ]);
  if (!configResponse.ok) {
    throw new Error(`Failed to load /client_configuration (HTTP ${configResponse.status})`);
  }
  const clientConfiguration = (await configResponse.json()) as ClientConfiguration;

  // Initialize error reporting as early as possible — before we build the
  // router and render any React. A render-time crash during the initial mount
  // (e.g. the Brave white-screen-on-login) used to happen before AppRoot's
  // effect could call this, so the SDKs were never set up and nothing was
  // reported. The current user id isn't known yet; AppRoot fills it in via
  // setCurrentUser once the AppRootQuery resolves.
  initErrorReporting(
    undefined,
    clientConfiguration.sentry_frontend_dsn,
    clientConfiguration.rollbar_client_access_token,
  );

  const authManager = AuthenticationManager.deserializeFromBrowser(
    clientConfiguration.oauth_frontend_application_uid ?? undefined,
  );
  authManager.issuerUrl = clientConfiguration.oidc_issuer_url ?? undefined;

  // Try to redeem the refresh cookie for an access token before we build the
  // Apollo client, so the first GraphQL query goes out authenticated when the
  // user already has a session. 401 means "no session yet" — keep going.
  await authManager.bootstrapFromCookie();

  const client = buildBrowserApolloClient(authenticityTokensManager, authManager);

  window.addEventListener(GraphQLNotAuthenticatedErrorEvent.type, async () => {
    // Don't interrupt an in-progress OAuth exchange on the callback page itself
    if (window.location.pathname === '/oauth/callback') {
      return;
    }
    const { redirectUrl } = await authManager.initiateAuthentication(window.location.href);
    window.location.href = redirectUrl.toString();
  });

  // Make the CDN host available for lazy chunk loading (renderBuiltUrl reads this at call time).
  if (clientConfiguration.assets_host) {
    window.intercodeAssetsHost = clientConfiguration.assets_host;
  }

  return { clientConfiguration, authenticityTokensManager, authManager, client };
})();

type BrowserRouter = ReturnType<typeof createBrowserRouter>;

// createBrowserRouter calls router.initialize() internally, which starts the
// initial navigation asynchronously. By the time our useEffect subscribes,
// the navigation may already be done — router.subscribe fires the callback
// synchronously (via a buffered state update) with the final state. Watching
// router.state.initialized (set to true once initial data loading completes)
// handles both "already done" and "still in progress" correctly.
function RouterLoadingOverlay({ router }: { router: BrowserRouter }) {
  const [ready, setReady] = useState(() => router.state.initialized);

  useLayoutEffect(() => {
    return router.subscribe((state) => {
      if (state.initialized) {
        setReady(true);
      }
    });
  }, [router]);

  if (ready) return null;

  return (
    <div className="text-center mt-5 custom-loading-indicator">
      <div className="spinner-border" role="status" />
      <span className="visually-hidden">Loading...</span>
    </div>
  );
}

function DataModeApplicationEntry() {
  const bootstrap = use(bootstrapPromise);

  const router = useMemo(
    () =>
      createBrowserRouter(
        [
          {
            id: 'root',
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
        <RouterLoadingOverlay router={router} />
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

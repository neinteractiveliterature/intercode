import 'regenerator-runtime/runtime';

import mountReactComponents from '../mountReactComponents';
import { StrictMode, Suspense, use, useLayoutEffect, useMemo, useState } from 'react';
import AuthenticityTokensManager, { getAuthenticityTokensURL } from 'AuthenticityTokensContext';
import { createBrowserRouter, RouterContextProvider, RouterProvider, RouteObject } from 'react-router';
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
import { checkAppEntrypointHeadersOnError } from '../checkAppEntrypointHeadersMatch';
import BootErrorBoundary from '../BootErrorBoundary';

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
  authManager.authorizationEndpoint = clientConfiguration.oidc_authorization_endpoint ?? undefined;
  authManager.endSessionEndpoint = clientConfiguration.oidc_end_session_endpoint ?? undefined;

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

// Wrap every route's lazy import so a failed chunk load — almost always a stale
// deploy whose hashed chunk no longer exists — reloads onto the fresh bundle
// instead of surfacing as an unrecoverable blank. Applied once to the whole tree.
function withEntrypointReloadOnLazy(routes: RouteObject[]): RouteObject[] {
  return routes.map((route) => {
    let { lazy } = route;
    if (typeof lazy === 'function') {
      const load = lazy;
      lazy = () => checkAppEntrypointHeadersOnError(load);
    }
    return {
      ...route,
      lazy,
      children: route.children ? withEntrypointReloadOnLazy(route.children) : route.children,
    } as RouteObject;
  });
}

// DataModeApplicationEntry gates RouterProvider on router.state.initialized.
//
// RouterProvider uses useState(router.state) for its initial state. If the
// router's initial navigation hasn't finished yet (initialized=false,
// renderFallback=true), RouterProvider renders null and then must use
// startTransition to escape that null state when the router fires. During
// that transition the DOM stays empty. Waiting until the router is initialized
// before mounting RouterProvider ensures useState captures initialized=true
// from the start, so RouterProvider renders content immediately.
function DataModeApplicationEntry() {
  const bootstrap = use(bootstrapPromise);

  const router = useMemo(
    () =>
      createBrowserRouter(
        withEntrypointReloadOnLazy([
          {
            id: 'root',
            lazy: () => import('root'),
            children: appRootRoutes,
          },
        ]),
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

  // Gate on router initialization so RouterProvider always mounts with
  // initialized=true. router.subscribe replays the buffered initial state
  // synchronously via the callback if the router finished before our effect
  // ran (react-router stores the update in bufferedInitialStateUpdate and
  // replays it to new subscribers immediately on subscribe()).
  const [routerReady, setRouterReady] = useState(() => router.state.initialized);
  useLayoutEffect(() => {
    return router.subscribe((state) => {
      if (state.initialized) setRouterReady(true);
    });
  }, [router]);

  if (!routerReady) {
    return <PageLoadingIndicator visible />;
  }

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
    <BootErrorBoundary>
      <Suspense fallback={<PageLoadingIndicator visible />}>
        <DataModeApplicationEntry />
      </Suspense>
    </BootErrorBoundary>
  );
}

mountReactComponents({ AppRoot: DataModeApplicationEntrySuspenseWrapper });

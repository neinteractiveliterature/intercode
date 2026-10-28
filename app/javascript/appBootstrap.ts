import AuthenticityTokensManager, { getAuthenticityTokensURL } from 'AuthenticityTokensContext';
import { RouterContextProvider } from 'react-router';
import { buildBrowserApolloClient, GraphQLNotAuthenticatedErrorEvent } from 'useIntercodeApolloClient';
import {
  apolloClientContext,
  authenticityTokensManagerContext,
  clientConfigurationContext,
  fetchContext,
  sessionContext,
  ClientConfiguration,
  appRootDataContext,
} from 'AppContexts';
import { AuthenticationManager } from './Authentication/authenticationManager';
import { ApolloClient } from '@apollo/client';
import { initErrorReporting } from 'ErrorReporting';

// What both browser entries (the data-mode router in packs/application.tsx and the framework-mode client entry) need
// before they can render: the client configuration, auth and Apollo client.

export type Bootstrap = {
  clientConfiguration: ClientConfiguration;
  authenticityTokensManager: AuthenticityTokensManager;
  authManager: AuthenticationManager;
  client: ApolloClient;
};

// The shell fetches /client_configuration itself to set the title and favicon (see layouts/_boot_preloads.html.erb).
// Use that if it worked, and otherwise make the request here so a failure is reported through the boot error path.
async function loadClientConfiguration(): Promise<ClientConfiguration> {
  const early = window.intercodeEarlyClientConfiguration;
  window.intercodeEarlyClientConfiguration = undefined;
  if (early) {
    try {
      return (await early) as ClientConfiguration;
    } catch {
      // fall through to our own request
    }
  }
  const configResponse = await fetch('/client_configuration', { credentials: 'same-origin' });
  if (!configResponse.ok) {
    throw new Error(`Failed to load /client_configuration (HTTP ${configResponse.status})`);
  }
  return (await configResponse.json()) as ClientConfiguration;
}

// The cookie refresh only needs the HttpOnly session cookie, not anything from /client_configuration, so start it
// right away rather than after the configuration has loaded. The OAuth settings get filled in on the same manager
// once they arrive.
export function startAppBootstrap(): Promise<Bootstrap> {
  const authManager = AuthenticationManager.deserializeFromBrowser();
  const cookieBootstrapPromise = authManager.bootstrapFromCookie();

  // Fetch /client_configuration *first*, then stand up the Apollo client using its values. This lets the
  // AuthenticationManager refresh expired access tokens (which requires the OAuth clientId and OIDC issuer URL)
  // without depending on server-rendered HTML.
  return (async () => {
    // /client_configuration is needed to construct the auth manager; the
    // authenticity-tokens refresh is independent and can run in parallel.
    const [clientConfiguration, authenticityTokensManager] = await Promise.all([
      loadClientConfiguration(),
      (async () => {
        const mgr = new AuthenticityTokensManager(fetch, undefined, getAuthenticityTokensURL());
        await mgr.refresh();
        return mgr;
      })(),
    ]);

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

    authManager.clientId = clientConfiguration.oauth_frontend_application_uid ?? undefined;
    authManager.issuerUrl = clientConfiguration.oidc_issuer_url ?? undefined;
    authManager.authorizationEndpoint = clientConfiguration.oidc_authorization_endpoint ?? undefined;
    authManager.endSessionEndpoint = clientConfiguration.oidc_end_session_endpoint ?? undefined;

    // Wait for the refresh cookie to be redeemed for an access token before we build the Apollo client, so the first
    // GraphQL query goes out authenticated when the user already has a session. 401 means "no session yet" — keep going.
    await cookieBootstrapPromise;

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
}

export function buildRouterContext(bootstrap: Bootstrap): RouterContextProvider {
  const context = new RouterContextProvider();
  context.set(apolloClientContext, bootstrap.client);
  context.set(fetchContext, fetch);
  context.set(authenticityTokensManagerContext, bootstrap.authenticityTokensManager);
  context.set(clientConfigurationContext, bootstrap.clientConfiguration);
  context.set(sessionContext, undefined);
  context.set(appRootDataContext, undefined);
  return context;
}

import 'regenerator-runtime/runtime';

import mountReactComponents from '../mountReactComponents';
import { StrictMode, use, useEffect, useMemo } from 'react';
import AuthenticityTokensManager, { getAuthenticityTokensURL } from 'AuthenticityTokensContext';
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
import { appRootRoutes } from 'AppRouter';
import { ApolloClient, OperationVariables } from '@apollo/client';
import { AuthenticationManager, AuthenticationManagerContext } from '../Authentication/authenticationManager';

const manager = new AuthenticityTokensManager(fetch, undefined, getAuthenticityTokensURL());
const refreshPromise = manager.refresh();
const authManager = AuthenticationManager.deserializeFromBrowser();
const client = buildBrowserApolloClient(manager, authManager);

export type DataModeApplicationEntryProps = {
  recaptchaSiteKey: string;
  railsDefaultActiveStorageServiceName: string;
  railsDirectUploadsUrl: string;
  oauthFrontendApplicationUid?: string;
  oidcIssuerUrl?: string;
  queryData?: ApolloClient.WriteQueryOptions<unknown, OperationVariables>[];
};

function DataModeApplicationEntry({
  recaptchaSiteKey,
  railsDefaultActiveStorageServiceName,
  railsDirectUploadsUrl,
  oauthFrontendApplicationUid,
  oidcIssuerUrl,
}: DataModeApplicationEntryProps) {
  use(refreshPromise);

  // Set auth manager config from Rails props once available
  useEffect(() => {
    authManager.clientId = oauthFrontendApplicationUid;
    authManager.issuerUrl = oidcIssuerUrl;
  }, [oauthFrontendApplicationUid, oidcIssuerUrl]);

  const clientConfigurationData = useMemo<ClientConfigurationQueryData>(
    () => ({
      __typename: 'Query',
      clientConfiguration: {
        __typename: 'ClientConfiguration',
        recaptcha_site_key: recaptchaSiteKey,
        rails_default_active_storage_service_name: railsDefaultActiveStorageServiceName,
        rails_direct_uploads_url: railsDirectUploadsUrl,
        oauth_frontend_application_uid: oauthFrontendApplicationUid ?? null,
        oidc_issuer_url: oidcIssuerUrl ?? null,
      },
    }),
    [
      recaptchaSiteKey,
      railsDefaultActiveStorageServiceName,
      railsDirectUploadsUrl,
      oauthFrontendApplicationUid,
      oidcIssuerUrl,
    ],
  );

  const router = useMemo(
    () =>
      // queryPreloadComplete &&
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
    [clientConfigurationData],
  );

  return (
    <StrictMode>
      <AuthenticationManagerContext.Provider value={authManager}>
        {router && <RouterProvider router={router} />}
      </AuthenticationManagerContext.Provider>
    </StrictMode>
  );
}

mountReactComponents({ AppRoot: DataModeApplicationEntry });

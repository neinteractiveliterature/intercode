import 'regenerator-runtime/runtime';

import mountReactComponents from '../mountReactComponents';
import { StrictMode, use, useEffect, useMemo, useState } from 'react';
import AuthenticityTokensManager, { getAuthenticityTokensURL } from '~/AuthenticityTokensContext';
import { createBrowserRouter, RouterContextProvider, RouterProvider } from 'react-router';
import { buildBrowserApolloClient } from '~/useIntercodeApolloClient';
import {
  apolloClientContext,
  authenticityTokensManagerContext,
  clientConfigurationDataContext,
  fetchContext,
  sessionContext,
} from '~/AppContexts';
import type { ClientConfigurationQueryData } from '~/serverQueries.generated';
import { ApolloProvider } from '@apollo/client/react';
import { appRootRoutes } from '~/AppRouter';

const manager = new AuthenticityTokensManager(fetch, undefined, getAuthenticityTokensURL());
const refreshPromise = manager.refresh();
const client = buildBrowserApolloClient(manager);

export type DataModeApplicationEntryProps = {
  recaptchaSiteKey: string;
  railsDefaultActiveStorageServiceName: string;
  railsDirectUploadsUrl: string;
  queryData?: ApolloClient.WriteQueryOptions<unknown, OperationVariables>[];
};

function DataModeApplicationEntry({
  recaptchaSiteKey,
  railsDefaultActiveStorageServiceName,
  railsDirectUploadsUrl,
  queryData,
}: DataModeApplicationEntryProps) {
  use(refreshPromise);

  const [queryPreloadComplete, setQueryPreloadComplete] = useState(false);
  useEffect(() => {
    if (queryData && Array.isArray(queryData)) {
      for (const query of queryData) {
        try {
          client.writeQuery(query);
        } catch {
          // don't blow up if we get a malformed query
        }
      }
    }

    setQueryPreloadComplete(true);
  }, [queryData]);

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
      queryPreloadComplete &&
      createBrowserRouter(
        [
          {
            lazy: () => import('~/root'),
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
    [clientConfigurationData, queryPreloadComplete],
  );

  return <StrictMode>{router && <RouterProvider router={router} />}</StrictMode>;
}

mountReactComponents({ AppRoot: DataModeApplicationEntry });

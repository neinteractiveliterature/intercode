import 'regenerator-runtime/runtime';

import mountReactComponents from '../mountReactComponents';
import { StrictMode, useMemo } from 'react';
import AuthenticityTokensManager, {
  AuthenticityTokensContext,
  getAuthenticityTokensURL,
} from 'AuthenticityTokensContext';
import {
  AppLoadContext,
  createBrowserRouter,
  RouteObject,
  RouterProvider,
  unstable_createContext,
  unstable_InitialContext,
} from 'react-router';
import routes from 'routes';
import { ProviderStack } from 'AppWrapper';
import { buildBrowserApolloClient } from 'useIntercodeApolloClient';
import { ApolloProvider } from '@apollo/client';
import { apolloClientContext, authenticityTokensManagerContext, fetchContext } from 'AppContexts';

const manager = new AuthenticityTokensManager(fetch, undefined, getAuthenticityTokensURL());
const client = buildBrowserApolloClient(manager);

function LibraryModeApplicationEntry() {
  const client = useMemo(() => buildBrowserApolloClient(manager), []);

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
            // TODO other contexts
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

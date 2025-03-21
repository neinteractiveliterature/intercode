import 'regenerator-runtime/runtime';

import mountReactComponents from '../mountReactComponents';
import { StrictMode, useMemo } from 'react';
import AuthenticityTokensManager, {
  AuthenticityTokensContext,
  getAuthenticityTokensURL,
} from 'AuthenticityTokensContext';
import { createBrowserRouter, RouteObject, RouterProvider } from 'react-router';
import routes from 'routes';

const manager = new AuthenticityTokensManager(fetch, undefined, getAuthenticityTokensURL());

function AppRoot() {
  const router = useMemo(() => createBrowserRouter([routes] as RouteObject[]), []);

  return (
    <StrictMode>
      <AuthenticityTokensContext.Provider value={manager}>
        <RouterProvider router={router} />
      </AuthenticityTokensContext.Provider>
    </StrictMode>
  );
}

mountReactComponents({ AppRoot });

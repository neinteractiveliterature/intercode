import 'regenerator-runtime/runtime';

import mountReactComponents from '../mountReactComponents';
import { StrictMode, useMemo } from 'react';
import { buildLibraryModeBrowserRouter } from 'libraryModeRouter';
import AuthenticityTokensManager, {
  AuthenticityTokensContext,
  getAuthenticityTokensURL,
} from 'AuthenticityTokensContext';
import { RouterProvider } from 'react-router';

const manager = new AuthenticityTokensManager(fetch, undefined, getAuthenticityTokensURL());

function AppRoot() {
  const router = useMemo(() => buildLibraryModeBrowserRouter(), []);

  return (
    <StrictMode>
      <AuthenticityTokensContext.Provider value={manager}>
        <RouterProvider router={router} />
      </AuthenticityTokensContext.Provider>
    </StrictMode>
  );
}

mountReactComponents({ AppRoot });

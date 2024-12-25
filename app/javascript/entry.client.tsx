import { startTransition, StrictMode } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { HydratedRouter } from 'react-router/dom';
import 'bootstrap';
import AuthenticityTokensManager, {
  AuthenticityTokensContext,
  getAuthenticityTokensURL,
} from 'AuthenticityTokensContext';

const manager = new AuthenticityTokensManager(undefined, getAuthenticityTokensURL());

startTransition(() => {
  hydrateRoot(
    document,
    <StrictMode>
      <AuthenticityTokensContext.Provider value={manager}>
        <HydratedRouter />
      </AuthenticityTokensContext.Provider>
    </StrictMode>,
  );
});

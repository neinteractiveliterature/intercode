import './styles/application.scss';
import 'bootstrap';
import { StrictMode, startTransition } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { HydratedRouter } from 'react-router/dom';
import { startAppBootstrap, buildRouterContext } from 'appBootstrap';
import { AuthenticationManagerContext } from './Authentication/authenticationManager';
import BootErrorBoundary from './BootErrorBoundary';

function ThrowBootError({ error }: { error: unknown }): never {
  throw error;
}

// Same startup as packs/application.tsx: refresh the session cookie and load /client_configuration first, then hand
// the results to the router through its context.
startAppBootstrap().then(
  (bootstrap) => {
    startTransition(() => {
      hydrateRoot(
        document,
        <StrictMode>
          <AuthenticationManagerContext.Provider value={bootstrap.authManager}>
            <HydratedRouter getContext={() => buildRouterContext(bootstrap)} />
          </AuthenticationManagerContext.Provider>
        </StrictMode>,
      );
    });
  },
  (error) => {
    createRoot(document.body).render(
      <BootErrorBoundary>
        <ThrowBootError error={error} />
      </BootErrorBoundary>,
    );
  },
);

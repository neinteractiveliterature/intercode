import './styles/application.scss';
import { StrictMode, startTransition } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { HydratedRouter } from 'react-router/dom';
import { startAppBootstrap, buildRouterContext } from 'appBootstrap';
import { AuthenticationManagerContext } from './Authentication/authenticationManager';
import BootErrorBoundary from './BootErrorBoundary';
import { afterContentShown } from './contentShown';

// Tells the recovery script in the shell (see shellRecovery.ts) that the entry loaded; from here on BootErrorBoundary
// handles failures
window.intercodeShellBooted = true;

// Bootstrap's JavaScript only drives the data-bs-* attributes in CMS content (tabs, collapses, dropdowns), through
// listeners on the document, so it can load once there is something to click
afterContentShown()
  .then(() => import('bootstrap'))
  .catch((error) => console.warn('Could not load Bootstrap', error));

function ThrowBootError({ error }: { error: unknown }): never {
  throw error;
}

// Refresh the session cookie and load /client_configuration first, then hand
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

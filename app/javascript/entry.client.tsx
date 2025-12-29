import { startTransition, StrictMode } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { HydratedRouter } from 'react-router/dom';
import AuthenticityTokensManager, { getAuthenticityTokensURL } from './AuthenticityTokensContext';
import { RouterContextProvider } from 'react-router';
import {
  apolloClientContext,
  authenticationManagerContext,
  authenticityTokensManagerContext,
  clientConfigurationDataContext,
  fetchContext,
  sessionContext,
} from './AppContexts';
import { buildBrowserApolloClient } from './useIntercodeApolloClient';
import { ClientConfigurationQueryDocument } from './serverQueries.generated';
import { AuthenticationManager } from './Authentication/authenticationManager';

import('./styles/application.scss');
import('bootstrap');

async function buildInitialContext() {
  const manager = new AuthenticityTokensManager(fetch, undefined, getAuthenticityTokensURL());
  await manager.refresh();

  const authenticationManager = AuthenticationManager.deserializeFromBrowser();

  const client = buildBrowserApolloClient(manager, authenticationManager);
  const { data, error } = await client.query({ query: ClientConfigurationQueryDocument });

  if (!data) {
    throw error;
  }

  const context = new RouterContextProvider();
  context.set(apolloClientContext, client);
  context.set(fetchContext, fetch);
  context.set(authenticityTokensManagerContext, manager);
  context.set(authenticationManagerContext, authenticationManager);
  context.set(clientConfigurationDataContext, data);
  context.set(sessionContext, undefined);
  return context;
}

startTransition(() => {
  hydrateRoot(
    document,
    <StrictMode>
      <HydratedRouter getContext={buildInitialContext} />
    </StrictMode>,
  );
});

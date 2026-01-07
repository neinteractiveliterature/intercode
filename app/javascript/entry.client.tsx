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
import { ApolloClient, ServerError } from '@apollo/client';

import('./styles/application.scss');
import('bootstrap');

async function fetchClientConfigurationData(client: ApolloClient, authenticationManager: AuthenticationManager) {
  try {
    const { data, error } = await client.query({ query: ClientConfigurationQueryDocument });
    if (!data) {
      throw error;
    }
    return data;
  } catch (error) {
    if (ServerError.is(error) && error.statusCode === 401) {
      await authenticationManager.reset();
      const { data, error } = await client.query({ query: ClientConfigurationQueryDocument });
      if (!data) {
        throw error;
      }

      return data;
    } else {
      throw error;
    }
  }
}

async function buildInitialContext() {
  const manager = new AuthenticityTokensManager(fetch, undefined, getAuthenticityTokensURL());
  await manager.refresh();

  const authenticationManager = AuthenticationManager.deserializeFromBrowser();
  const client = buildBrowserApolloClient(authenticationManager);
  const clientConfigurationData = await fetchClientConfigurationData(client, authenticationManager);

  const context = new RouterContextProvider();
  context.set(apolloClientContext, client);
  context.set(fetchContext, fetch);
  context.set(authenticityTokensManagerContext, manager);
  context.set(authenticationManagerContext, authenticationManager);
  context.set(clientConfigurationDataContext, clientConfigurationData!);
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

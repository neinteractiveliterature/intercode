import { createRequestHandler } from '@react-router/express';
import {
  apolloClientContext,
  authenticityTokensManagerContext,
  clientConfigurationDataContext,
  fetchContext,
  sessionContext,
} from 'AppContexts';
import AuthenticityTokensManager, {
  fetchAuthenticityTokens,
  getAuthenticityTokensURL,
} from 'AuthenticityTokensContext';
import express from 'express';
import { Session, SessionData, unstable_InitialContext } from 'react-router';
import { buildServerApolloClient } from 'serverApolloClient.server';
import { buildServerFetcher, ServerFetcher } from 'ServerFetcher.server';
import { commitSession, getSession, getSessionUuid, SessionFlashData } from 'sessions';
import nodeFetch from 'node-fetch';
import { ClientConfigurationQueryData, ClientConfigurationQueryDocument } from 'serverQueries.generated';

let clientConfigurationData: ClientConfigurationQueryData | undefined;

async function getClientConfiguration() {
  if (clientConfigurationData) {
    return clientConfigurationData;
  }

  const client = await buildServerApolloClient({
    cookie: undefined,
    hostname: undefined,
    session: await getSession(),
    authenticityTokensManager: new AuthenticityTokensManager(
      nodeFetch as unknown as typeof fetch,
      undefined,
      getAuthenticityTokensURL(),
    ),
    fetch: nodeFetch as unknown as typeof fetch,
  });
  const { data } = await client.query({ query: ClientConfigurationQueryDocument });
  clientConfigurationData = data;
  return data;
}

const authenticityTokensManagers: Map<string, AuthenticityTokensManager> = new Map();

async function getAuthenticityTokensManager(
  fetcher: typeof fetch,
  session: Session<SessionData, SessionFlashData>,
  cookie?: string,
) {
  const uuid = await getSessionUuid(session);
  const existing = authenticityTokensManagers.get(uuid);
  if (existing) {
    return existing;
  }

  const authenticityTokensUrl = getAuthenticityTokensURL();
  const tokensResponse = await fetchAuthenticityTokens(fetcher, authenticityTokensUrl, cookie ? { cookie } : {});
  const tokens = await tokensResponse.json();
  const manager = new AuthenticityTokensManager(fetcher, tokens, authenticityTokensUrl);
  authenticityTokensManagers.set(uuid, manager);
  return manager;
}

export const app = express();

app.use(
  createRequestHandler({
    build: () => import('virtual:react-router/server-build'),
    getLoadContext: async (req, res) => {
      const serverFetch: ServerFetcher = buildServerFetcher(res);
      const session = await getSession(req.headers.cookie);

      const manager = await getAuthenticityTokensManager(serverFetch, session, req.headers.cookie);

      serverFetch.setCookie(await commitSession(session));

      const client = await buildServerApolloClient({
        cookie: req.headers.cookie,
        hostname: req.hostname,
        session,
        authenticityTokensManager: manager,
        fetch: serverFetch,
      });

      const clientConfigurationData = await getClientConfiguration();

      const context: unstable_InitialContext = new Map();
      context.set(apolloClientContext, client);
      context.set(clientConfigurationDataContext, clientConfigurationData);
      context.set(authenticityTokensManagerContext, manager);
      context.set(fetchContext, serverFetch);
      context.set(sessionContext, session);
      return context;
    },
  }),
);

import { createRequestHandler } from '@react-router/express';
import AuthenticityTokensManager, {
  fetchAuthenticityTokens,
  getAuthenticityTokensURL,
} from 'AuthenticityTokensContext.js';
import express from 'express';
import { readFileSync } from 'node:fs';
import http from 'node:http';
import https from 'node:https';
import { AppLoadContext, Session, unstable_InitialContext } from 'react-router';
import { buildServerApolloClient } from 'serverApolloClient.server.js';
import { ClientConfigurationQueryData, ClientConfigurationQueryDocument } from 'serverQueries.generated.js';
import { commitSession, getSession, getSessionUuid, SessionData, SessionFlashData } from 'sessions.js';
import { buildServerFetcher, ServerFetcher } from 'ServerFetcher.server.js';
import nodeFetch from 'node-fetch';
import {
  apolloClientContext,
  authenticityTokensManagerContext,
  clientConfigurationDataContext,
  fetchContext,
  sessionContext,
} from 'AppContexts.js';

async function getClientConfiguration() {
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

async function createServer() {
  const viteDevServer =
    process.env.NODE_ENV === 'production'
      ? undefined
      : await import('vite').then((vite) =>
          vite.createServer({
            configFile: 'vite-framework.config.mts',
            server: {
              middlewareMode: true,
            },
          }),
        );

  const clientConfigurationData = await getClientConfiguration();

  const app = express();

  // handle asset requests
  if (viteDevServer) {
    app.use(viteDevServer.middlewares);
  } else {
    app.use(
      '/assets',
      express.static('build/client/assets', {
        immutable: true,
        maxAge: '1y',
      }),
    );
  }
  app.use(express.static('build/client', { maxAge: '1h' }));

  // we're proxying the direct_uploads path to avoid cookie and CORS issues
  const clientConfigurationDataWithProxy: ClientConfigurationQueryData = {
    ...clientConfigurationData,
    clientConfiguration: {
      ...clientConfigurationData.clientConfiguration,
      rails_direct_uploads_url: '/rails/active_storage/direct_uploads',
    },
  };

  // handle SSR requests
  app.all(
    '*',
    createRequestHandler({
      build: viteDevServer
        ? () => viteDevServer.ssrLoadModule('virtual:react-router/server-build')
        : // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          await import('./build/server/index.js'),
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

  return app;
}

createServer().then((app) => {
  if (process.env.NODE_ENV === 'production') {
    const port = process.env.PORT || 3000;
    http.createServer(app).listen(port, () => console.log(`Listening on HTTP port ${port}`));
  } else {
    https
      .createServer(
        {
          key: readFileSync('./dev_certificate.key'),
          cert: readFileSync('./dev_certificate.crt'),
        },
        app,
      )
      .listen(3135, () => console.log('Listening on HTTPS port 3135'));
  }
});

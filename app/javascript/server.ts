import { createRequestHandler } from '@react-router/express';
import AuthenticityTokensManager, {
  fetchAuthenticityTokens,
  getAuthenticityTokensURL,
} from 'AuthenticityTokensContext.js';
import express from 'express';
import { readFileSync } from 'node:fs';
import http from 'node:http';
import https from 'node:https';
import { AppLoadContext, Session } from 'react-router';
import { buildServerApolloClient } from 'serverApolloClient.server.js';
import { ClientConfigurationQueryData, ClientConfigurationQueryDocument } from 'serverQueries.generated.js';
import { commitSession, getSession, getSessionUuid, SessionData, SessionFlashData } from 'sessions.js';

async function getClientConfiguration() {
  const client = await buildServerApolloClient({
    cookie: undefined,
    hostname: undefined,
    session: await getSession(),
    authenticityTokensManager: new AuthenticityTokensManager(undefined, getAuthenticityTokensURL()),
  });
  const { data } = await client.query({ query: ClientConfigurationQueryDocument });
  return data;
}

const authenticityTokensManagers: Map<string, AuthenticityTokensManager> = new Map();

async function getAuthenticityTokensManager(session: Session<SessionData, SessionFlashData>, cookie?: string) {
  const uuid = await getSessionUuid(session);
  const existing = authenticityTokensManagers.get(uuid);
  if (existing) {
    return existing;
  }

  const authenticityTokensUrl = getAuthenticityTokensURL();
  const tokens = await fetchAuthenticityTokens(authenticityTokensUrl, cookie ? { cookie } : {});
  const manager = new AuthenticityTokensManager(tokens, authenticityTokensUrl);
  authenticityTokensManagers.set(uuid, manager);
  return manager;
}

async function createServer() {
  const viteDevServer =
    process.env.NODE_ENV === 'production'
      ? undefined
      : await import('vite').then((vite) =>
          vite.createServer({
            server: { middlewareMode: true },
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
        : await import('./build/server/index.js'),
      getLoadContext: async (req, res) => {
        const session = await getSession(req.headers.cookie);
        const authenticityTokensManager = await getAuthenticityTokensManager(session, req.headers.cookie);
        res.setHeader('set-cookie', await commitSession(session));

        const client = await buildServerApolloClient({
          cookie: req.headers.cookie,
          hostname: req.hostname,
          session,
          authenticityTokensManager,
        });
        return {
          client,
          clientConfigurationData: clientConfigurationDataWithProxy,
          authenticityTokensManager,
        } satisfies AppLoadContext;
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

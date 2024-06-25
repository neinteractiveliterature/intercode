import { renderToPipeableStream } from 'react-dom/server';
import express from 'express';
import { StaticRouter } from 'react-router-dom/server';
import { AppWrapperInnerProps } from './AppWrapper';
import AppRoot from './AppRoot';
import React, { useMemo } from 'react';
import { isbot } from 'isbot';
import { ApolloClient, ApolloProvider, createHttpLink, InMemoryCache, NormalizedCacheObject } from '@apollo/client';
import {
  GetAppLayoutContentDocument,
  GetAppLayoutContentQueryData,
  GetAppLayoutContentQueryVariables,
} from './serverQueries.generated';
import { ComponentMap, parseDocument } from './parsePageContent';
import NavigationBar from './NavigationBar';
import { JSDOM } from 'jsdom';
import { createLogger, stdSerializers } from 'bunyan';
import bunyanMiddleware from 'bunyan-middleware';
import { parseArgs } from 'util';
import AuthenticityTokensContext, { useAuthenticityTokens } from './AuthenticityTokensContext';
import https from 'https';
import http from 'http';
import fs from 'fs';
import proxy from 'express-http-proxy';

const CLI_OPTIONS = {
  port: {
    type: 'string',
    default: '3136',
  },
  backend: {
    type: 'string',
  },
  help: {
    type: 'boolean',
  },
  'ssl-key': {
    type: 'string',
  },
  'ssl-cert': {
    type: 'string',
  },
} as const;

const args = parseArgs({
  options: CLI_OPTIONS,
});

if (args.values.help) {
  console.log(CLI_OPTIONS);
  process.exit(0);
}

if (!args.values.backend) {
  console.error('--backend is required');
  process.exit(1);
}

const app = express();
const port = Number.parseInt(args.values.port ?? '3136');

const logger = createLogger({
  name: 'intercode-ssr',
  serializers: stdSerializers,
});

app.use(
  bunyanMiddleware({
    headerName: 'X-Request-Id',
    propertyName: 'reqId',
    logName: 'req_id',
    obscureHeaders: ['Authorization', 'X-CSRF-Token'],
    logger: logger,
  }),
);

const APP_SHELL_COMPONENT_MAP: ComponentMap = {
  AppRoot,
  NavigationBar,
};

type AppShellProps = JSX.IntrinsicAttributes & {
  appRootContent: string;
  url: string;
  authenticityTokens: AppWrapperInnerProps['authenticityTokens'];
  apolloClient: ApolloClient<NormalizedCacheObject>;
};

function AppShell({ appRootContent, url, authenticityTokens, apolloClient }: AppShellProps) {
  const authenticityTokensProviderValue = useAuthenticityTokens(authenticityTokens);
  const content = useMemo(() => {
    const dom = new JSDOM(appRootContent);
    // eslint-disable-next-line no-underscore-dangle
    return parseDocument(dom.window._document, APP_SHELL_COMPONENT_MAP, dom.window.Node, dom.window);
  }, [appRootContent]);

  return (
    <React.StrictMode>
      <StaticRouter basename="/" location={url}>
        <AuthenticityTokensContext.Provider value={authenticityTokensProviderValue}>
          <ApolloProvider client={apolloClient}>
            <html lang="en">
              <head>{content.headComponents}</head>
              <body data-intercode-ssr-hydrate={JSON.stringify({ appRootContent })}>{content.bodyComponents}</body>
            </html>
          </ApolloProvider>
        </AuthenticityTokensContext.Provider>
      </StaticRouter>
    </React.StrictMode>
  );
}

app.get('/authenticity_tokens', proxy(args.values.backend));
app.get('/packs/*', proxy(args.values.backend));
app.post('/graphql', proxy(args.values.backend));

app.get('*', async (req, res) => {
  let didError = false;
  const isCrawler = isbot(req.headers['user-agent']);
  const client = new ApolloClient({
    ssrMode: true,

    link: createHttpLink({
      uri: `${args.values.backend}/graphql`,

      credentials: 'same-origin',

      headers: {
        cookie: req.headers['cookie'] ?? '',
        host: req.headers['host'] ?? '',
        'user-agent': 'IntercodeSSR/1.0',
      },
    }),

    cache: new InMemoryCache(),
  });

  const result = await client.query<GetAppLayoutContentQueryData, GetAppLayoutContentQueryVariables>({
    query: GetAppLayoutContentDocument,
    variables: { host: req.headers['host'] ?? '', path: req.path },
  });

  const { pipe } = renderToPipeableStream(
    <AppShell
      url={req.url}
      appRootContent={result.data.cmsParentByDomain.effectiveCmsLayout.app_root_content}
      apolloClient={client}
      // TODO
      authenticityTokens={{ graphql: '' }}
    />,
    {
      bootstrapScripts: ['https://localhost:3135/packs/application.js'],
      onShellReady() {
        if (!isCrawler) {
          res.statusCode = didError ? 500 : 200;
          res.setHeader('content-type', 'text/html');
          pipe(res);
        }
      },
      onAllReady() {
        if (isCrawler) {
          res.statusCode = didError ? 500 : 200;
          res.setHeader('content-type', 'text/html');
          if (didError) {
            res.send('<h1>Something went wrong</h1>');
          } else {
            pipe(res);
          }
        }
      },
      onError(error) {
        didError = true;
        console.error(error);
      },
      onShellError(error) {
        console.error(error);
        if (!isCrawler) {
          res.statusCode = 500;
          res.setHeader('content-type', 'text/html');
          res.send('<h1>Something went wrong</h1>');
        }
      },
    },
  );
});

function buildServer() {
  if (args.values['ssl-key'] && args.values['ssl-cert']) {
    console.log('Starting with SSL');
    return https.createServer(
      {
        key: fs.readFileSync(args.values['ssl-key']),
        cert: fs.readFileSync(args.values['ssl-cert']),
      },
      app,
    );
  } else {
    console.log('Starting without SSL');
    return http.createServer(app);
  }
}

buildServer().listen({ port }, () => {
  console.log(`Listening on port ${port}`);
});

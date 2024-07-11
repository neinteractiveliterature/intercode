// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React from 'react';
import { isbot } from 'isbot';
import {
  GetAppLayoutContentDocument,
  GetAppLayoutContentQueryData,
  GetAppLayoutContentQueryVariables,
} from './queries.generated';
import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client';
import { renderToPipeableStream } from 'react-dom/server';
import AppShell from './AppShell';
import { Request, Response } from 'express';

export default async function renderStatic(req: Request, res: Response) {
  let didError = false;
  const isCrawler = isbot(req.headers['user-agent']);
  const client = new ApolloClient({
    ssrMode: true,

    link: createHttpLink({
      uri: `${req.app.get('intercodeBackend')}/graphql`,

      credentials: 'same-origin',

      headers: {
        cookie: req.headers['cookie'] ?? '',
        host: req.headers['host'] ?? '',
        'user-agent': 'IntercodeSSR/1.0',
      },
    }),

    cache: new InMemoryCache(),
  });

  const domain = (req.headers['host'] ?? '').replace(/:\d+$/, '');

  const result = await client.query<GetAppLayoutContentQueryData, GetAppLayoutContentQueryVariables>({
    query: GetAppLayoutContentDocument,
    variables: { domain, path: req.path },
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
}

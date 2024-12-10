import { createRequestHandler } from '@react-router/express';
import express from 'express';
import { readFileSync } from 'node:fs';
import http from 'node:http';
import https from 'node:https';
import { buildServerApolloClient } from 'serverApolloClient.server.js';

async function createServer() {
  const viteDevServer =
    process.env.NODE_ENV === 'production'
      ? undefined
      : await import('vite').then((vite) =>
          vite.createServer({
            server: { middlewareMode: true },
          }),
        );

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

  // handle SSR requests
  app.all(
    '*',
    createRequestHandler({
      build: viteDevServer
        ? () => viteDevServer.ssrLoadModule('virtual:react-router/server-build')
        : await import('./build/server/index.js'),
      getLoadContext: async (req, res) => {
        const setCookie = (value: string) => res.setHeader('set-cookie', value);
        const client = buildServerApolloClient({
          cookie: req.headers.cookie,
          hostname: req.hostname,
          setCookie,
        });
        return { client };
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

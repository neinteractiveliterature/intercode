// @ts-check

import express from 'express';
import { readFileSync } from 'node:fs';
import http from 'node:http';
import https from 'node:https';
import morgan from 'morgan';
import compression from 'compression';

// Short-circuit the type-checking of the built output.
const BUILD_PATH = './build/server/index.js';
const DEVELOPMENT = process.env.NODE_ENV === 'development';
const PORT = Number.parseInt(process.env.PORT ?? (DEVELOPMENT ? '3135' : '3000'));

const app = express();

app.use(compression());
app.disable('x-powered-by');

async function createServer() {
  if (DEVELOPMENT) {
    console.log('Starting development server');
    const viteDevServer = await import('vite').then((vite) =>
      vite.createServer({
        configFile: 'vite-framework.config.mts',
        server: { middlewareMode: true },
      }),
    );
    app.use(viteDevServer.middlewares);
    app.use(async (req, res, next) => {
      try {
        const source = await viteDevServer.ssrLoadModule('./app/javascript/server/app.ts');
        return await source.app(req, res, next);
      } catch (error) {
        if (typeof error === 'object' && error instanceof Error) {
          viteDevServer.ssrFixStacktrace(error);
        }
        next(error);
      }
    });
  } else {
    console.log('Starting production server');
    app.use('/assets', express.static('build/client/assets', { immutable: true, maxAge: '1y' }));
    app.use(express.static('build/client', { maxAge: '1h' }));
    app.use(await import(BUILD_PATH).then((mod) => mod.app));
  }

  app.use(morgan('tiny'));

  return app;
}

createServer().then((app) => {
  if (DEVELOPMENT) {
    https
      .createServer(
        {
          key: readFileSync('./dev_certificate.key'),
          cert: readFileSync('./dev_certificate.crt'),
        },
        app,
      )
      .listen(PORT, () => console.log(`Listening on HTTPS port ${PORT}`));
  } else {
    http.createServer(app).listen(PORT, () => console.log(`Listening on HTTP port ${PORT}`));
  }
});

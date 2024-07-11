import express from 'express';
import { createLogger, stdSerializers } from 'bunyan';
import bunyanMiddleware from 'bunyan-middleware';
import proxy from 'express-http-proxy';
import https from 'https';
import http from 'http';
import fs from 'fs';
import { CLIOptions } from './cliCommand';
import renderStatic from './renderStatic';

export function buildApp(backend: string) {
  const app = express();

  const logger = createLogger({
    name: 'intercode-ssr',
    serializers: stdSerializers,
  });

  app.use((req, res, next) => {
    req.app.set('intercodeBackend', backend);
    req.app.set('logger', logger);
    next();
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

  app.get('/authenticity_tokens', proxy(backend));
  app.get('/packs/*', proxy(backend));
  app.post('/graphql', proxy(backend));
  app.get('*', renderStatic);

  return app;
}

export function buildServer(args: CLIOptions, app: express.Express) {
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

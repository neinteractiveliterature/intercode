import environment from './environment.js';
import { readFileSync } from 'fs';

export default {
  ...environment,
  mode: 'development',
  cache: true,
  devtool: 'cheap-module-source-map',
  target: 'web',
  entry: {
    ...environment.entry,
    'dev-mode-graphiql': './app/javascript/DevModeGraphiql',
  },
  output: {
    ...environment.output,
    crossOriginLoading: 'anonymous',
    pathinfo: true,
    publicPath: 'https://localhost:3135/packs/',
  },
  devServer: {
    // clientLogLevel: 'none',
    static: {
      directory: environment.output.path,
      publicPath: environment.output.publicPath,
    },
    historyApiFallback: {
      disableDotRule: true,
    },
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization',
    },
    webSocketServer: 'ws',
    https: {
      key: readFileSync('./dev_certificate.key'),
      cert: readFileSync('./dev_certificate.crt'),
      cacert: readFileSync('./dev_ca.crt'),
    },
  },
};

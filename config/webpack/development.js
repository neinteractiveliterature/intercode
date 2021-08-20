import environment from './environment.js';

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
    historyApiFallback: {
      disableDotRule: true,
    },
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization',
    },
    https: {
      key: './dev_certificate.key',
      cert: './dev_certificate.crt',
      cacert: './dev_ca.crt',
    },
    webSocketServer: 'ws',
    allowedHosts: 'all',
  },
};

const environment = require('./environment');
const fs = require('fs');

module.exports = {
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
    clientLogLevel: 'none',
    contentBase: environment.output.path,
    publicPath: environment.output.publicPath,
    disableHostCheck: true,
    historyApiFallback: {
      disableDotRule: true,
    },
    stats: {
      errorDetails: true,
    },
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization',
    },
    transportMode: 'ws',
    https: true,
    key: fs.readFileSync('./dev_certificate.key'),
    cert: fs.readFileSync('./dev_certificate.crt'),
    ca: fs.readFileSync('./dev_ca.crt'),
  },
};

const environment = require('./environment');
const DashboardPlugin = require("webpack-dashboard/plugin");

module.exports = {
  ...environment,
  mode: 'development',
  cache: true,
  devtool: 'cheap-module-source-map',
  output: {
    ...environment.output,
    crossOriginLoading: 'anonymous',
    pathinfo: true,
    publicPath: 'http://localhost:3135/packs/',
  },
  plugins: [
    ...environment.plugins,
    new DashboardPlugin({ port: 3135 }),
  ],
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
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
      "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
    },
    transportMode: 'ws'
  },
};

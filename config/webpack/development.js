const { config: { outputPath: contentBase, publicPath }, devServer } = require('@rails/webpacker');
const environment = require('./environment');
const DashboardPlugin = require("webpack-dashboard/plugin");

module.exports = {
  ...environment,
  mode: 'development',
  cache: true,
  devtool: 'cheap-module-source-map',
  output: {
    ...environment.output,
    pathinfo: true,
    ...(
      devServer.hmr
      ? { filename: '[name]-[hash].js' }
      : {}
    ),
  },
  plugins: [
    ...environment.plugins,
    ...(
      devServer.hmr
      ? ([
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NamedModulesPlugin(),
      ])
      : []
    ),
    new DashboardPlugin({ port: devServer.port }),
  ],
  devServer: {
    clientLogLevel: 'none',
    compress: devServer.compress,
    quiet: devServer.quiet,
    disableHostCheck: devServer.disable_host_check,
    host: devServer.host,
    port: devServer.port,
    https: devServer.https,
    hot: devServer.hmr,
    contentBase,
    inline: devServer.inline,
    useLocalIp: devServer.use_local_ip,
    public: devServer.public,
    publicPath,
    historyApiFallback: {
      disableDotRule: true,
    },
    headers: devServer.headers,
    overlay: devServer.overlay,
    stats: {
      errorDetails: true,
    },
    watchOptions: devServer.watch_options,
  },
};

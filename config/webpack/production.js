const process = require('process')
const environment = require('./environment')

const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const RollbarSourceMapPlugin = require('rollbar-sourcemap-webpack-plugin');

if (process.env.ANALYZE_BUNDLE_SIZE) {
  environment.plugins.append(
    'BundleAnalyzer',
    new BundleAnalyzerPlugin()
  )
} else {
  environment.plugins.append(
    'RollbarSourcemap',
    new RollbarSourceMapPlugin({
      accessToken: process.env.ROLLBAR_ACCESS_TOKEN,
      version: process.env.SOURCE_VERSION,
      publicPath: process.env.ROLLBAR_PUBLIC_PATH,
    }),
  );
}

module.exports = environment.toWebpackConfig()

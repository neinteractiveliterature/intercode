const environment = require('./environment');
const process = require('process');
const TerserPlugin = require('terser-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

if (process.env.ANALYZE_BUNDLE_SIZE) {
  const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

  environment.plugins.push(new BundleAnalyzerPlugin());
} else {
  const RollbarSourceMapPlugin = require('rollbar-sourcemap-webpack-plugin');

  if (process.env.ROLLBAR_ACCESS_TOKEN) {
    environment.plugins.push(new RollbarSourceMapPlugin({
      accessToken: process.env.ROLLBAR_ACCESS_TOKEN,
      version: process.env.SOURCE_VERSION,
      publicPath: process.env.ROLLBAR_PUBLIC_PATH,
    }));
  }
}

module.exports = {
  ...environment,
  mode: 'production',
  devtool: 'nosources-source-map',
  stats: 'normal',
  bail: true,
  plugins: [
    ...environment.plugins,
    new CompressionPlugin({
      filename: '[path].gz[query]',
      algorithm: 'gzip',
      test: /\.(js|css|html|json|ico|svg|eot|otf|ttf)$/
    }),
    new OptimizeCSSAssetsPlugin(),
  ],
  optimization: {
    minimizer: [
      new TerserPlugin({
        parallel: true,
        cache: true,
        sourceMap: true,
        terserOptions: {
          parse: {
            // Let uglify-js parse ecma 8 code but always output
            // ES5 compliant code for older browsers
            ecma: 8,
          },
          compress: {
            ecma: 5,
            warnings: false,
            comparisons: false,
          },
          mangle: {
            safari10: true,
          },
          output: {
            ecma: 5,
            comments: false,
            ascii_only: true,
          },
        },
      }),
    ],
  },
};

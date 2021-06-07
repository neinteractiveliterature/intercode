import process from 'process';
import TerserPlugin from 'terser-webpack-plugin';
import CompressionPlugin from 'compression-webpack-plugin';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import RollbarSourceMapPlugin from 'rollbar-sourcemap-webpack-plugin';
import environment from './environment.js';

if (process.env.ANALYZE_BUNDLE_SIZE) {
  environment.plugins.push(new BundleAnalyzerPlugin());
} else if (process.env.ROLLBAR_ACCESS_TOKEN) {
  environment.plugins.push(
    new RollbarSourceMapPlugin({
      accessToken: process.env.ROLLBAR_ACCESS_TOKEN,
      version: process.env.SOURCE_VERSION,
      publicPath: process.env.ROLLBAR_PUBLIC_PATH,
    }),
  );
}

export default {
  ...environment,
  mode: 'production',
  devtool: 'nosources-source-map',
  stats: 'normal',
  bail: true,
  plugins: [
    ...environment.plugins,
    new CompressionPlugin({
      filename: '[path][base].gz[query]',
      algorithm: 'gzip',
      test: /\.(js|css|html|json|ico|svg|eot|otf|ttf)$/,
    }),
    new CssMinimizerPlugin(),
  ],
  optimization: {
    minimizer: [
      new TerserPlugin({
        parallel: true,
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

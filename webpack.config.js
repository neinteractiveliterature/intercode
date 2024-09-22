/* eslint-disable @typescript-eslint/no-require-imports */
const path = require('path');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const RollbarSourceMapPlugin = require('rollbar-sourcemap-webpack-plugin');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const ASSET_PATH =
  process.env.ASSET_PATH || (process.env.NODE_ENV === 'production' ? '/packs/' : 'https://localhost:3135/packs/');

const cssLoadersConfig = [
  MiniCssExtractPlugin.loader,
  require.resolve('css-loader'),
  require.resolve('postcss-loader'),
];

const config = {
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  devtool: process.env.NODE_ENV === 'production' ? 'source-map' : 'eval-source-map',
  entry: {
    /// !!!!!! IMPORTANT !!!!!!
    /// When adding new production entry points, make sure to add them to production.rb's list of assets to exclude
    /// from caching!  Otherwise, subsequent deploys will still have old versions of entry points.
    /// !!!!!! IMPORTANT !!!!!!

    application: './app/javascript/packs/applicationEntry.ts',
    'application-styles': './app/javascript/packs/applicationStyles.ts',
    ...(process.env.NODE_ENV === 'production'
      ? {}
      : {
          'dev-mode-graphiql': './app/javascript/DevModeGraphiql.tsx',
        }),
  },
  output: {
    filename: '[name].js',
    chunkFilename: '[name]-[chunkhash].chunk.js',
    hotUpdateChunkFilename: '[name]-[fullhash].hot-update.js',
    path: path.resolve('public/packs'),
    publicPath: ASSET_PATH,
    environment: {
      arrowFunction: false,
    },
  },
  optimization: {
    minimizer: [
      new TerserPlugin({
        minify: TerserPlugin.swcMinify,
        // `terserOptions` options will be passed to `swc` (`@swc/core`)
        // Link to options - https://swc.rs/docs/config-js-minify
        terserOptions: {},
      }),
    ],
  },
  devServer: {
    port: 3135,
    historyApiFallback: {
      disableDotRule: true,
    },
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization',
    },
    host: '0.0.0.0',
    server: {
      type: 'https',
      options: {
        key: './dev_certificate.key',
        cert: './dev_certificate.crt',
        ca: './dev_ca.crt',
      },
    },
    webSocketServer: 'ws',
    allowedHosts: 'all',
    hot: false,
    watchFiles: {
      options: {
        ignored: [path.resolve(__dirname, 'public/product_images'), path.resolve(__dirname, 'public/uploads')],
      },
    },
  },
  cache: {
    type: 'filesystem',
    cacheDirectory: path.resolve(__dirname, 'build-cache/webpack-web'),
  },
  module: {
    rules: [
      {
        test: /\.(jpg|jpeg|png|gif|tiff|ico|svg|eot|otf|ttf|woff|woff2)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          ...cssLoadersConfig,
          { loader: require.resolve('sass-loader'), options: { sassOptions: { quietDeps: true } } },
        ],
      },
      {
        test: /\.css$/i,
        use: cssLoadersConfig,
      },
      {
        test: /\.(mjs|js|jsx|ts|tsx)?(\.erb)?$/,
        exclude: [/node_modules/, /\.yalc/],
        use: [
          {
            loader: require.resolve('swc-loader'),
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.png', '.svg', '.gif', '.jpeg', '.jpg'],
    alias: {
      'lodash.isequal': 'lodash-es/isEqual',
    },
    fallback: {
      stream: require.resolve('stream-browserify'),
      crypto: require.resolve('crypto-browserify'),
      events: require.resolve('events'),
      buffer: require.resolve('buffer'),
      punycode: require.resolve('punycode'),
      path: require.resolve('path-browserify'),
    },
  },
  plugins: [
    new webpack.DefinePlugin({
      __DEV__: JSON.stringify(process.env.NODE_ENV !== 'production'),
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV ?? 'development'),
      'process.env.ASSET_PATH': JSON.stringify(ASSET_PATH),
    }),
    new MiniCssExtractPlugin({
      filename: '[name]-[chunkhash].css',
    }),
    new CaseSensitivePathsPlugin(),
  ],
};

if (process.env.ANALYZE_BUNDLE_SIZE) {
  config.plugins.push(new BundleAnalyzerPlugin());
}

if (process.env.ROLLBAR_ACCESS_TOKEN) {
  config.plugins.push(
    new RollbarSourceMapPlugin({
      accessToken: process.env.ROLLBAR_ACCESS_TOKEN,
      version: process.env.SOURCE_VERSION,
      publicPath: process.env.ROLLBAR_PUBLIC_PATH,
    }),
  );
}

module.exports = config;

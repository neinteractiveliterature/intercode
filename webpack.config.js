/* eslint-disable @typescript-eslint/no-var-requires */
const { resolve } = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const { WebpackManifestPlugin } = require('webpack-manifest-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const RollbarSourceMapPlugin = require('rollbar-sourcemap-webpack-plugin');
const webpack = require('webpack');

const ASSET_PATH =
  process.env.ASSET_PATH || (process.env.NODE_ENV === 'production' ? '/packs/' : 'https://localhost:3135/packs/');

const config = {
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  devtool: process.env.NODE_ENV === 'production' ? 'source-map' : 'eval-source-map',
  entry: {
    application: './app/javascript/packs/applicationEntry.ts',
    bootstrap: './app/javascript/packs/bootstrap.ts',
    'browser-warning': './app/javascript/displayBrowserWarning.tsx',
    ...(process.env.NODE_ENV === 'production'
      ? {}
      : {
          'dev-mode-graphiql': './app/javascript/DevModeGraphiql.tsx',
        }),
  },
  output: {
    filename: '[name]-[chunkhash].js',
    chunkFilename: '[name]-[chunkhash].chunk.js',
    hotUpdateChunkFilename: '[id]-[fullhash].hot-update.js',
    path: resolve('public/packs'),
    publicPath: ASSET_PATH,
    environment: {
      arrowFunction: false,
    },
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
    https: {
      key: './dev_certificate.key',
      cert: './dev_certificate.crt',
      cacert: './dev_ca.crt',
    },
    webSocketServer: 'ws',
    allowedHosts: 'all',
  },
  cache: {
    type: 'filesystem',
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
          MiniCssExtractPlugin.loader,
          require.resolve('css-loader'),
          require.resolve('postcss-loader'),
          require.resolve('sass-loader'),
        ],
      },
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, require.resolve('css-loader'), require.resolve('postcss-loader')],
      },
      {
        test: /displayBrowserWarning\.[tj]sx?$/,
        use: [
          {
            loader: require.resolve('babel-loader'),
            options: {
              presets: [
                [
                  '@babel/env',
                  {
                    targets: {
                      browsers: ['> 1%', 'last 2 versions', 'ie 8'],
                    },
                  },
                ],
              ],
            },
          },
        ],
      },
      {
        test: /\.(jsx)$/,
        include: [/node_modules\/cadmus-navbar-admin/],
        type: 'javascript/auto',
        use: [
          {
            loader: require.resolve('babel-loader'),
          },
        ],
      },
      {
        test: /\.(mjs|js|jsx|ts|tsx)?(\.erb)?$/,
        exclude: [/node_modules/, /\.yalc/],
        use: [
          {
            loader: require.resolve('babel-loader'),
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.png', '.svg', '.gif', '.jpeg', '.jpg'],
    alias: {
      'lodash.isequal': 'lodash-es/isEqual',
      'react/jsx-dev-runtime': 'react/jsx-dev-runtime.js',
      'react/jsx-runtime': 'react/jsx-runtime.js',
    },
    fallback: {
      stream: require.resolve('stream-browserify'),
      crypto: require.resolve('crypto-browserify'),
      events: require.resolve('events'),
      buffer: require.resolve('buffer'),
      punycode: require.resolve('punycode'),
    },
  },
  plugins: [
    new webpack.DefinePlugin({
      __DEV__: JSON.stringify(process.env.NODE_ENV !== 'production'),
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV ?? 'development'),
      'process.env.ASSET_PATH': JSON.stringify(ASSET_PATH),
    }),
    new CaseSensitivePathsPlugin(),
    new MiniCssExtractPlugin({
      filename: '[name]-[contenthash:8].css',
      chunkFilename: '[name]-[contenthash:8].chunk.css',
    }),
    new WebpackManifestPlugin({
      fileName: 'assets-manifest.json',
    }),
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

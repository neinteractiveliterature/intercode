const webpack = require('webpack');
const process = require('process');
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const WebpackAssetsManifest = require('webpack-assets-manifest');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const getStyleRule = require('./getStyleRule');

const CACHE_PATH = 'tmp/cache/webpack';

module.exports = {
  entry: {
    application: './app/javascript/packs/applicationEntry.ts',
    'browser-warning': './app/javascript/displayBrowserWarning.tsx',
  },
  output: {
    filename: '[name]-[chunkhash].js',
    chunkFilename: '[name]-[chunkhash].chunk.js',
    hotUpdateChunkFilename: '[id]-[hash].hot-update.js',
    path: path.resolve('public/packs'),
    publicPath: '/packs/',
  },
  cache: {
    type: 'filesystem',
    cacheDirectory: path.resolve(CACHE_PATH, 'cache-loader'),
  },
  module: {
    rules: [
      {
        test: /\.(jpg|jpeg|png|gif|tiff|ico|svg|eot|otf|ttf|woff|woff2)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[path][name]-[hash].[ext]',
              context: path.resolve('app/javascript'),
            },
          },
        ],
      },
      getStyleRule(/\.(css)$/i),
      getStyleRule(/\.(scss|sass)$/i, [
        {
          loader: 'sass-loader',
          options: { sourceMap: true },
        },
      ]),
      {
        use: {
          loader: 'thread-loader',
        },
      },
      {
        test: /displayBrowserWarning\.jsx$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              cacheDirectory: path.resolve(CACHE_PATH, 'babel-loader'),
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
        include: /node_modules\/cadmus-navbar-admin/,
        type: 'javascript/auto',
        use: [
          {
            loader: 'babel-loader',
            options: {
              cacheDirectory: path.resolve(CACHE_PATH, 'babel-loader'),
            },
          },
        ],
      },
      {
        test: /\.(mjs|js|jsx|ts|tsx)?(\.erb)?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              cacheDirectory: path.resolve(CACHE_PATH, 'babel-loader'),
            },
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: [
      '.js',
      '.jsx',
      '.ts',
      '.tsx',
      '.sass',
      '.scss',
      '.css',
      '.png',
      '.svg',
      '.gif',
      '.jpeg',
      '.jpg',
    ],
    fallback: {
      buffer: require.resolve('buffer/'),
      events: require.resolve('events/'),
      stream: require.resolve('stream-browserify'),
    },
    alias: {
      'lodash.isequal': 'lodash-es/isEqual',
    },
  },
  plugins: [
    new webpack.EnvironmentPlugin(JSON.parse(JSON.stringify(process.env))),
    new CaseSensitivePathsPlugin(),
    new MiniCssExtractPlugin({
      filename: '[name]-[contenthash:8].css',
      chunkFilename: '[name]-[contenthash:8].chunk.css',
    }),
    new WebpackAssetsManifest({
      writeToDisk: true,
      publicPath: true,
    }),
  ],
};

const webpack = require('webpack');
const process = require('process');
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const WebpackAssetsManifest = require('webpack-assets-manifest');
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const { config } = require('@rails/webpacker');
const getStyleRule = require('./getStyleRule');
const threadLoader = require('thread-loader');

threadLoader.warmup({
  // pool options, like passed to loader options
  // must match loader options to boot the correct pool
}, [
  // modules to load
  // can be any module, i. e.
  'babel-loader',
  '@babel/preset-env',
  'sass-loader',
  'graphql-tag/loader'
]);

// I got really fed up with Webpacker's config management.  It reinvents a whole lot of wheels.
//
// So, I'm just using Webpacker's config module to read the stuff out of config/webpacker.yml and
// handle it correctly, as well as Webpacker's getStyleRule utility, and then writing our own
// Webpack config based on it.

module.exports = {
  entry: {
    application: './app/javascript/packs/application.js',
    'browser-warning': './app/javascript/displayBrowserWarning.jsx',
  },
  output: {
    filename: '[name]-[chunkhash].js',
    chunkFilename: '[name]-[chunkhash].chunk.js',
    hotUpdateChunkFilename: '[id]-[hash].hot-update.js',
    path: config.outputPath,
    publicPath: config.publicPath,
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
              context: path.join(config.source_path),
            }
          }
        ]
      },
      getStyleRule(/\.(css)$/i),
      getStyleRule(/\.(scss|sass)$/i, false, [
        {
          loader: 'cache-loader',
          options: {
            cacheDirectory: path.join(config.cache_path, 'cache-loader'),
          },
        },
        {
          loader: 'sass-loader',
          options: { sourceMap: true },
        },
      ]),
      {
        use: {
          loader: 'thread-loader'
        },
      },
      {
        test: /displayBrowserWarning\.jsx$/,
        use: [
          {
            loader: 'cache-loader',
            options: {
              cacheDirectory: path.join(config.cache_path, 'cache-loader'),
            },
          },
          {
            loader: 'babel-loader',
            options: {
              cacheDirectory: path.join(config.cache_path, 'babel-loader'),
              presets: [
                ["@babel/env",
                  {
                    "targets": {
                      "browsers": ["> 1%", "last 2 versions", "ie 8"]
                    }
                  }
                ]
              ]
            }
          }
        ],
      },
      {
        test: /\.(mjs|js\.flow|jsx)$/,
        include: /node_modules/,
        type: "javascript/auto",
        use: [
          {
            loader: 'cache-loader',
            options: {
              cacheDirectory: path.join(config.cache_path, 'cache-loader'),
            },
          },
          {
            loader: 'babel-loader',
            options: {
              cacheDirectory: path.join(config.cache_path, 'babel-loader')
            }
          }
        ],
      },
      {
        test: /\.(mjs|js|jsx)?(\.erb)?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'cache-loader',
            options: {
              cacheDirectory: path.join(config.cache_path, 'cache-loader'),
            },
          },
          {
            loader: 'babel-loader',
            options: {
              cacheDirectory: path.join(config.cache_path, 'babel-loader')
            }
          }
        ],
      },
      {
        test: /\.(gql|graphql)$/,
        use: [{ loader: 'graphql-tag/loader' }],
      },
    ],
  },
  resolve: {
    extensions: config.extensions,
    alias: {
      'lodash.isequal': 'lodash-es/isEqual'
    },
  },
  plugins: [
    new webpack.EnvironmentPlugin(JSON.parse(JSON.stringify(process.env))),
    // new LodashModuleReplacementPlugin({
    //   shorthands: true,
    // }),
    new CaseSensitivePathsPlugin(),
    new MiniCssExtractPlugin({
      filename: '[name]-[contenthash:8].css',
      chunkFilename: '[name]-[contenthash:8].chunk.css'
    }),
    new WebpackAssetsManifest({
      writeToDisk: true,
      publicPath: true
    }),
    // don't load all of moment's locales
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
  ],
  node: {
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty',
  },
};

const webpack = require('webpack');
const process = require('process');
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const WebpackAssetsManifest = require('webpack-assets-manifest');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
const { config } = require('@rails/webpacker');
const getStyleRule = require('@rails/webpacker/package/utils/get_style_rule');

// I got really fed up with Webpacker's config management.  It reinvents a whole lot of wheels.
//
// So, I'm just using Webpacker's config module to read the stuff out of config/webpacker.yml and
// handle it correctly, as well as Webpacker's getStyleRule utility, and then writing our own
// Webpack config based on it.

module.exports = {
  entry: {
    application: './app/javascript/packs/application.js',
  },
  module: {
    rules: [
      getStyleRule(/\.(css)$/i),
      getStyleRule(/\.(scss|sass)$/i, false, [
        {
          loader: 'sass-loader',
          options: { sourceMap: true },
        },
      ]),
      getStyleRule(/\.(css)$/i, true),
      getStyleRule(/\.(scss|sass)$/i, true, [
        {
          loader: 'sass-loader',
          options: { sourceMap: true },
        },
      ]),
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
      {
        test: /\.(gql|graphql)$/,
        use: [{ loader: 'graphql-tag/loader' }],
      },
    ],
  },
  resolve: {
    extensions: config.extensions,
  },
  plugins: [
    new LodashModuleReplacementPlugin(),
    new webpack.EnvironmentPlugin(JSON.parse(JSON.stringify(process.env))),
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

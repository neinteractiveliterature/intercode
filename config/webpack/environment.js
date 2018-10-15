const { environment } = require('@rails/webpacker')
const webpack = require('webpack')
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');

// We removed all our provides!  But, if we need to add more back, let's do that
//
// environment.plugins.set(
//   'Provide',
//   new webpack.ProvidePlugin({
//   }),
// )

environment.loaders.append('graphql',
  { test: /\.(gql|graphql)$/, use: [{ loader: 'graphql-tag/loader' }] },
);

environment.plugins.prepend(
  'LodashModuleReplacementPlugin',
  new LodashModuleReplacementPlugin(),
);

// don't load all of moment's locales
environment.plugins.append(
  'Ignore',
  new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
)

module.exports = environment

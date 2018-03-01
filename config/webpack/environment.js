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

// memoized-class-decorator uses let in its source :(
environment.loaders.get('babel').exclude = /node_modules\/(?!(memoized-class-decorator)\/).*/;

//
// environment.loaders.get('sass').use.unshift({
//   loader: 'cache-loader'
// });

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

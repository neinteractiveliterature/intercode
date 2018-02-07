const { environment } = require('@rails/webpacker')
const webpack = require('webpack')

// We removed all our provides!  But, if we need to add more back, let's do that
//
// environment.plugins.set(
//   'Provide',
//   new webpack.ProvidePlugin({
//   }),
// )

// environment.loaders.get('babel').use.unshift({
//   loader: 'cache-loader'
// });
//
// environment.loaders.get('sass').use.unshift({
//   loader: 'cache-loader'
// });

// don't load all of moment's locales
environment.plugins.append(
  'Ignore',
  new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
)

module.exports = environment

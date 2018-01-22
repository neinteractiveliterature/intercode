const { environment } = require('@rails/webpacker')
const webpack = require('webpack')

// We removed all our provides!  But, if we need to add more back, let's do that
//
// environment.plugins.set(
//   'Provide',
//   new webpack.ProvidePlugin({
//   }),
// )

// don't load all of moment's locales
environment.plugins.set(
  'Ignore',
  new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
)

module.exports = environment

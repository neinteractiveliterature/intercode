const { environment } = require('@rails/webpacker')
const webpack = require('webpack')

environment.plugins.set(
  'Provide',
  new webpack.ProvidePlugin({
    $: ['jquery'],
    jQuery: ['jquery'],
    Collapse: 'exports-loader?Dropdown!bootstrap/js/dist/collapse',
    Dropdown: 'exports-loader?Dropdown!bootstrap/js/dist/dropdown',
    Popper: ['popper.js', 'default'],
    Util: 'exports-loader?Util!bootstrap/js/dist/util',
  }),
)

// don't load all of moment's locales
environment.plugins.set(
  'Ignore',
  new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
)

module.exports = environment

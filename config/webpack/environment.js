const { environment } = require('@rails/webpacker')
const webpack = require('webpack')

environment.plugins.set(
  'Provide',
  new webpack.ProvidePlugin({
    $: 'jquery',
    jQuery: 'jquery',
    jquery: 'jquery',
    Popper: ['popper.js', 'default'],
    Util: "exports-loader?Util!bootstrap/js/dist/util",
    Dropdown: "exports-loader?Dropdown!bootstrap/js/dist/dropdown",
  })
)

module.exports = environment

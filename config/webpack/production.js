const environment = require('./environment')

const BabelMinifyPlugin = require("babel-minify-webpack-plugin")
const CompressionPlugin = require('compression-webpack-plugin')

environment.plugins.delete('UglifyJs');
environment.plugins.set(
  'BabelMinify',
  new BabelMinifyPlugin(),
);

module.exports = environment.toWebpackConfig()

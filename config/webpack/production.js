const environment = require('./environment')

const BabelMinifyPlugin = require("babel-minify-webpack-plugin")
const CompressionPlugin = require('compression-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

environment.plugins.delete('UglifyJs');
environment.plugins.set(
  'BabelMinify',
  new BabelMinifyPlugin(),
);
// environment.plugins.set(
//   'BundleAnalyzer',
//   new BundleAnalyzerPlugin()
// )

module.exports = environment.toWebpackConfig()

const process = require('process')
const environment = require('./environment')

const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

if (process.env.ANALYZE_BUNDLE_SIZE) {
  environment.plugins.append(
    'BundleAnalyzer',
    new BundleAnalyzerPlugin()
  )
}

module.exports = environment.toWebpackConfig()

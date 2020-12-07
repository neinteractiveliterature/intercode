const path = require('path');
const webpack = require('webpack');
const WebpackShellPluginNext = require('webpack-shell-plugin-next');
const environment = require('./environment');

const entry = {
  diffTranslations: './script/diffTranslations.ts',
  mergeTranslations: './script/mergeTranslations.ts',
  renderApp: './script/renderApp.ts',
  renderFormResponseChangeGroup: './script/renderFormResponseChangeGroup.tsx',
};

module.exports = {
  ...environment,
  entry,
  devtool: 'cheap-source-map',
  output: {
    filename: '[name]',
    path: path.resolve('bin'),
  },
  target: 'node',
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  plugins: [
    ...environment.plugins,
    new webpack.BannerPlugin({
      banner: '#!/usr/bin/env node',
      raw: true,
    }),
    new WebpackShellPluginNext({
      onBuildEnd: {
        scripts: Object.keys(entry).map((scriptName) => `chmod +x bin/${scriptName}`),
      },
    }),
  ],
};

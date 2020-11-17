const path = require('path');
const webpack = require('webpack');
const WebpackShellPluginNext = require('webpack-shell-plugin-next');
const environment = require('./environment');

const entryPoints = {
  buildTimezoneData: './script/buildTimezoneData.ts',
  diffTranslations: './script/diffTranslations.ts',
  mergeTranslations: './script/mergeTranslations.ts',
  renderFormResponseChangeGroup: './script/renderFormResponseChangeGroup.tsx',
};

module.exports = {
  ...environment,
  entry: entryPoints,
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
        scripts: Object.keys(entryPoints).map((entryPoint) => `chmod +x bin/${entryPoint}`),
      },
    }),
  ],
};

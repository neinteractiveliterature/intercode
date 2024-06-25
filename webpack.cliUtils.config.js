/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const webpack = require('webpack');
const WebpackShellPluginNext = require('webpack-shell-plugin-next');
const config = require('./webpack.config');

module.exports = {
  ...config,
  entry: {
    diffTranslations: './script/diffTranslations.ts',
    mergeTranslations: './script/mergeTranslations.ts',
    renderFormResponseChangeGroup: './script/renderFormResponseChangeGroup.tsx',
    server: './app/javascript/server.tsx',
  },
  devtool: 'cheap-source-map',
  output: {
    filename: '[name].cjs',
    path: path.resolve('bin'),
  },
  target: 'node',
  mode: 'development', // we always want good tracebacks from the CLI utils even in prod
  cache: {
    type: 'filesystem',
    cacheDirectory: path.resolve(__dirname, 'build-cache/webpack-cli'),
  },
  plugins: [
    ...config.plugins,
    new webpack.BannerPlugin({
      banner: '#!/usr/bin/env node',
      raw: true,
    }),
    new WebpackShellPluginNext({
      onBuildEnd: {
        scripts: [
          'chmod +x bin/diffTranslations.cjs',
          'chmod +x bin/mergeTranslations.cjs',
          'chmod +x bin/renderFormResponseChangeGroup.cjs',
          'chmod +x bin/server.cjs',
        ],
      },
    }),
  ],
};

const path = require('path');
const webpack = require('webpack');
const WebpackShellPlugin = require('webpack-shell-plugin');
const environment = require('./environment');

module.exports = {
  ...environment,
  entry: {
    renderFormResponseChangeGroup: './script/renderFormResponseChangeGroup.jsx',
  },
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
    new WebpackShellPlugin({
      onBuildEnd: ['chmod +x bin/renderFormResponseChangeGroup'],
    }),
  ],
};

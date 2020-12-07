const path = require('path');
const webpack = require('webpack');
const WebpackShellPluginNext = require('webpack-shell-plugin-next');
const environment = require('./environment');

const entry = {
  server: './ssr/server.ts',
};

module.exports = {
  ...environment,
  entry,
  devtool: 'cheap-source-map',
  output: {
    filename: '[name]',
    path: path.resolve('ssr-dist'),
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
        scripts: Object.keys(entry).map((scriptName) => `chmod +x ssr-dist/${scriptName}`),
      },
    }),
  ],
};

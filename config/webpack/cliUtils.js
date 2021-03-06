import { resolve } from 'path';
import webpack from 'webpack';
import WebpackShellPluginNext from 'webpack-shell-plugin-next';
import environment from './environment.js';

export default {
  ...environment,
  entry: {
    diffTranslations: './script/diffTranslations.ts',
    mergeTranslations: './script/mergeTranslations.ts',
    renderFormResponseChangeGroup: './script/renderFormResponseChangeGroup.tsx',
  },
  devtool: 'cheap-source-map',
  output: {
    filename: '[name]',
    path: resolve('bin'),
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
        scripts: [
          'chmod +x bin/diffTranslations',
          'chmod +x bin/mergeTranslations',
          'chmod +x bin/renderFormResponseChangeGroup',
        ],
      },
    }),
  ],
};

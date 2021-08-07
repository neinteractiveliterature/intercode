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
    filename: '[name].cjs',
    path: resolve('bin'),
  },
  target: 'node',
  mode: 'development', // we always want good tracebacks from the CLI utils even in prod
  plugins: [
    ...environment.plugins,
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
        ],
      },
    }),
  ],
};

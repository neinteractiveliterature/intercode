/* eslint-disable @typescript-eslint/no-var-requires */
const esbuild = require('esbuild');
const { pnpPlugin } = require('@yarnpkg/esbuild-plugin-pnp');
const resolvePlugin = require('esbuild-plugin-resolve');
const { sassPlugin } = require('esbuild-sass-plugin');

esbuild
  .build({
    entryPoints: ['app/javascript/packs/application.ts', 'app/javascript/packs/applicationStyles.ts'],
    bundle: true,
    outdir: 'esbuild-output',
    format: 'esm',
    loader: {
      '.svg': 'file',
    },
    splitting: true,
    minify: process.env.NODE_ENV === 'production',
    plugins: [
      resolvePlugin({
        stream: require.resolve('stream-browserify'),
        crypto: require.resolve('crypto-browserify'),
        path: require.resolve('path-browserify'),
      }),
      {
        name: 'markDataURIsExternal',
        setup(build) {
          build.onResolve({ filter: /^data:/ }, (args) => {
            return { path: args.path, external: true };
          });
        },
      },
      sassPlugin({
        type: 'style',
      }),
      pnpPlugin(),
    ],
  })
  .catch(() => process.exit(1));

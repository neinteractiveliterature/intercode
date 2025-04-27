import { UserConfig } from 'vite';
import reactSwc from '@vitejs/plugin-react-swc';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import commonConfig, { absolutePath } from './viteConfigCommon';
import { browserRouterPlugin } from './browserRouterPlugin';

export default {
  ...commonConfig,
  build: {
    ...commonConfig.build,
    rollupOptions: {
      ...commonConfig.build?.rollupOptions,
      input: {
        'application-styles': absolutePath('./app/javascript/packs/applicationStyles.ts'),
        ...(process.env.NODE_ENV === 'production'
          ? {}
          : {
              'dev-mode-graphiql': absolutePath('./app/javascript/DevModeGraphiql.tsx'),
            }),
        application: absolutePath('./app/javascript/packs/applicationEntry.ts'),
      },
      output: {
        ...commonConfig.build?.rollupOptions?.output,
        dir: absolutePath('./public/packs'),
      },
    },
  },
  experimental: {
    renderBuiltUrl: (filename, { hostType }) => {
      if (hostType !== 'js' || filename === 'setPublicPath.ts') {
        return { relative: true };
      } else {
        return { runtime: `window.__intercodeAssetURL(${JSON.stringify(filename)})` };
      }
    },
  },
  plugins: [
    ...(commonConfig.plugins ?? []),
    nodePolyfills(),
    reactSwc(),
    browserRouterPlugin(absolutePath('./app/javascript/routes.ts')),
  ],
} satisfies UserConfig;

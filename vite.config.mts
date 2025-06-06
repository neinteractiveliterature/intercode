import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tsconfigPaths from 'vite-tsconfig-paths';
import { fileURLToPath } from 'url';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import { globalDefines } from './globalDefines.mts';

export function absolutePath(relativePath: string) {
  return fileURLToPath(new URL(relativePath, import.meta.url));
}

export default defineConfig({
  plugins: [react(), tsconfigPaths(), nodePolyfills()],
  resolve: {
    mainFields: ['module'],
  },
  define: globalDefines,
  experimental: {
    renderBuiltUrl: (filename, { hostType }) => {
      if (hostType !== 'js' || filename === 'setPublicPath.ts') {
        return { relative: true };
      } else {
        return { runtime: `window.__intercodeAssetURL(${JSON.stringify(filename)})` };
      }
    },
  },
  build: {
    copyPublicDir: false,
    rollupOptions: {
      // tree shaking is causing empty GraphQL document constants as of Rollup 4.27,
      // hopefully can remove this eventually
      treeshake: false,
      input: {
        application: absolutePath('./app/javascript/packs/applicationEntry.ts'),
        'application-styles': absolutePath('./app/javascript/packs/applicationStyles.ts'),
        ...(process.env.NODE_ENV === 'production'
          ? {}
          : {
              'dev-mode-graphiql': absolutePath('./app/javascript/DevModeGraphiql.tsx'),
            }),
      },
      output: {
        dir: absolutePath('./public/packs'),
        entryFileNames: '[name].js',
        manualChunks: {
          apollo: ['@apollo/client', 'apollo-upload-client/createUploadLink.mjs'],
          codemirror: [
            '@codemirror/state',
            '@codemirror/view',
            '@codemirror/language',
            '@codemirror/lang-html',
            '@codemirror/lang-json',
            '@codemirror/lang-markdown',
            '@lezer/common',
          ],
          currencyCodes: ['@breezehr/currency-codes'],
          graphql: ['graphql'],
          i18next: ['i18next', 'react-i18next'],
          lodash: ['lodash'],
          luxon: ['luxon'],
          reactRouter: ['react-router'],
        },
      },
    },
  },
  css: {
    modules: {
      localsConvention: 'camelCaseOnly',
    },
    preprocessorOptions: {
      scss: {
        // can't get import to work until Bootstrap supports it
        silenceDeprecations: ['import', 'legacy-js-api'],
        quietDeps: true,
      },
    },
  },
  server: {
    port: 3135,
    host: '0.0.0.0',
    origin: 'https://assets.intercode.test:3135',
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization',
    },
    https: {
      key: absolutePath('./dev_certificate.key'),
      cert: absolutePath('./dev_certificate.crt'),
      ca: absolutePath('./dev_ca.crt'),
    },
    warmup: {
      clientFiles: [absolutePath('./app/javascript/packs/applicationEntry.ts')],
    },
  },
  preview: {
    port: 3135,
    host: '0.0.0.0',
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization',
    },
    https: {
      key: absolutePath('./dev_certificate.key'),
      cert: absolutePath('./dev_certificate.crt'),
      ca: absolutePath('./dev_ca.crt'),
    },
  },
});

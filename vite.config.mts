import { defineConfig, Plugin, ViteDevServer } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import { vitePlugin as remix } from '@remix-run/dev';
import { fileURLToPath } from 'url';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import { globalDefines } from './globalDefines.mts';
import morgan from 'morgan';

export function absolutePath(relativePath: string) {
  return fileURLToPath(new URL(relativePath, import.meta.url));
}

// https://github.com/remix-run/remix/discussions/7850
function morganPlugin(): Plugin {
  return {
    name: 'morgan-plugin',
    configureServer(server: ViteDevServer) {
      return () => {
        server.middlewares.use(morgan('tiny'));
      };
    },
  };
}

export default defineConfig({
  plugins: [
    tsconfigPaths(),
    morganPlugin(),
    nodePolyfills(),
    !process.env.VITEST &&
      remix({
        appDirectory: absolutePath('./app/javascript'),
      }),
  ],
  ssr: {
    noExternal: ['@neinteractiveliterature/litform', '@apollo/client'],
  },
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
          reactRouter: ['react-router', 'react-router-dom'],
        },
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
    // downgrade to HTTP 1.1 to work around https://github.com/remix-run/remix/issues/7867
    proxy: {},
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

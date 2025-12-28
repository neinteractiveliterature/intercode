import { defineConfig } from 'vite';
import { reactRouter } from '@react-router/dev/vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import { fileURLToPath } from 'url';
import { globalDefines } from './globalDefines';

export function absolutePath(relativePath: string) {
  return fileURLToPath(new URL(relativePath, import.meta.url));
}

export default defineConfig({
  plugins: [reactRouter(), tsconfigPaths()],
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
      output: {
        // manualChunks: {
        //   apollo: ['@apollo/client', 'apollo-upload-client/UploadHttpLink.mjs'],
        //   codemirror: [
        //     '@codemirror/state',
        //     '@codemirror/view',
        //     '@codemirror/language',
        //     '@codemirror/lang-html',
        //     '@codemirror/lang-json',
        //     '@codemirror/lang-markdown',
        //     '@lezer/common',
        //   ],
        //   currencyCodes: ['@breezehr/currency-codes'],
        //   graphql: ['graphql'],
        //   graphiql: ['graphiql', '@graphiql/toolkit'],
        //   i18next: ['i18next', 'react-i18next'],
        //   lodash: ['lodash'],
        //   luxon: ['luxon'],
        //   reactRouter: ['react-router'],
        // },
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
    proxy: {
      // Proxy API requests to Rails backend
      '/graphql': {
        target: 'https://intercode.test:5050',
        changeOrigin: true,
        secure: false,
      },
      '/authenticity_tokens': {
        target: 'https://intercode.test:5050',
        changeOrigin: true,
        secure: false,
      },
      '/custom_login': {
        target: 'https://intercode.test:5050',
        changeOrigin: true,
        secure: false,
      },
      '/users': {
        target: 'https://intercode.test:5050',
        changeOrigin: true,
        secure: false,
      },
      '/rails': {
        target: 'https://intercode.test:5050',
        changeOrigin: true,
        secure: false,
      },
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

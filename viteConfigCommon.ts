import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import { fileURLToPath } from 'url';
import { globalDefines } from './globalDefines.mts';
import { envOnlyMacros } from 'vite-env-only';

export function absolutePath(relativePath: string) {
  return fileURLToPath(new URL(relativePath, import.meta.url));
}

export default defineConfig({
  plugins: [tsconfigPaths(), envOnlyMacros()],
  ssr: {
    noExternal: [
      '@neinteractiveliterature/litform',
      '@apollo/client',
      'react-helmet-async',
      'apollo-upload-client',
      '@codemirror/state',
      '@codemirror/view',
      '@codemirror/language',
      '@codemirror/lang-html',
      '@codemirror/lang-json',
      '@codemirror/lang-markdown',
      '@lezer/common',
      '@breezehr/currency-codes',
      'graphql',
      'i18next',
      'react-i18next',
      'lodash',
      'luxon',
      'react-router',
    ],
  },
  optimizeDeps: {
    exclude: ['node-fetch'],
  },
  resolve: {
    mainFields: ['module'],
  },
  define: globalDefines,
  css: {
    preprocessorOptions: {
      scss: {
        // can't get import to work until Bootstrap supports it
        silenceDeprecations: ['import', 'legacy-js-api'],
        quietDeps: true,
      },
    },
    modules: {
      localsConvention: 'camelCaseOnly',
    },
  },
  build: {
    copyPublicDir: false,
    rollupOptions: {
      // tree shaking is causing empty GraphQL document constants as of Rollup 4.27,
      // hopefully can remove this eventually
      treeshake: false,
      output: {
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

/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tsconfigPaths from 'vite-tsconfig-paths';
import { fileURLToPath } from 'url';

const ASSET_PATH =
  process.env.ASSET_PATH || (process.env.NODE_ENV === 'production' ? '/packs/' : 'https://localhost:3135/packs/');

function absolutePath(relativePath: string) {
  return fileURLToPath(new URL(relativePath, import.meta.url));
}

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  resolve: {
    mainFields: ['module'],
  },
  define: {
    __DEV__: JSON.stringify(process.env.NODE_ENV !== 'production'),
    NODE_ENV: JSON.stringify(process.env.NODE_ENV ?? 'development'),
    ASSET_PATH: JSON.stringify(ASSET_PATH),
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
  },
  test: {
    coverage: {
      enabled: true,
      include: ['./app/javascript/**/*.{js,jsx,ts,tsx}'],
      reportsDirectory: absolutePath('./coverage'),
      reporter: ['text', 'lcov'],
      reportOnFailure: true,
    },
    environment: 'jsdom',
    globals: true,
    setupFiles: [absolutePath('./test/javascript/setupTests.ts')],
    testTimeout: 10000,
    reporters: [
      'default',
      ['junit', { outputFile: absolutePath('./test/reports/TEST-jest.xml') }],
      ['html', { outputFile: absolutePath('./test/html_reports/jest-report.html') }],
    ],
  },
});

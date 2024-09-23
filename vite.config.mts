/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tsconfigPaths from 'vite-tsconfig-paths';
import legacy from '@vitejs/plugin-legacy';
import { dynamicBase } from 'vite-plugin-dynamic-base';
import { fileURLToPath } from 'url';

const ASSET_PATH =
  process.env.ASSET_PATH || (process.env.NODE_ENV === 'production' ? '/packs/' : 'https://localhost:3135/packs/');

function absolutePath(relativePath: string) {
  return fileURLToPath(new URL(relativePath, import.meta.url));
}

export default defineConfig({
  plugins: [legacy(), react(), tsconfigPaths(), dynamicBase({ transformIndexHtml: true })],
  resolve: {
    mainFields: ['module'],
  },
  base: '/__dynamic_base__/',
  define: {
    __DEV__: JSON.stringify(process.env.NODE_ENV !== 'production'),
    NODE_ENV: JSON.stringify(process.env.NODE_ENV ?? 'development'),
    ASSET_PATH: JSON.stringify(ASSET_PATH),
  },
  build: {
    copyPublicDir: false,
    outDir: absolutePath('./public/packs-vite'),
    rollupOptions: {
      input: {
        application: absolutePath('./app/javascript/packs/applicationEntry.ts'),
        'application-styles': absolutePath('./app/javascript/packs/applicationStyles.ts'),
        index: absolutePath('./index.html'),
        ...(process.env.NODE_ENV === 'production'
          ? {}
          : {
              'dev-mode-graphiql': absolutePath('./app/javascript/DevModeGraphiql.tsx'),
            }),
      },
      output: {
        entryFileNames: '[name].js',
      },
    },
  },
  server: {
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

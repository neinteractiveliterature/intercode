import { defineConfig } from 'vitest/config';
import viteConfig, { absolutePath } from './vite.config.mts';

const viteConfigWithoutHttps = defineConfig({
  ...viteConfig,
  server: {
    ...viteConfig.server,
    https: undefined,
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

export default viteConfigWithoutHttps;

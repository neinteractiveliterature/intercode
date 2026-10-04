import { defineConfig } from 'vitest/config';
import viteConfig, { absolutePath } from './vite.config.mts';

const viteConfigWithoutHttps = defineConfig({
  ...viteConfig,
  server: {
    ...viteConfig.server,
    https: undefined,
    proxy: undefined,
  },
  test: {
    coverage: {
      enabled: process.env['COVERAGE'] ? true : false,
      include: ['app/javascript/**/*.{js,jsx,ts,tsx}'],
      exclude: ['app/javascript/AppRouter.tsx'],
      reportsDirectory: absolutePath('./coverage'),
      reporter: ['text', 'cobertura'],
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
    server: {
      deps: {
        // The Testing Library packages have to be processed together so that they all share one copy of
        // @testing-library/dom.  Otherwise user-event ends up with its own copy, which React Testing Library hasn't
        // configured to wrap events in act(), and every user interaction logs "not wrapped in act(...)" warnings.
        inline: [
          '@neinteractiveliterature/litform',
          '@testing-library/dom',
          '@testing-library/react',
          '@testing-library/user-event',
        ],
      },
    },
  },
});

export default viteConfigWithoutHttps;

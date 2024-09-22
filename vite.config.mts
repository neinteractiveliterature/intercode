/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tsconfigPaths from 'vite-tsconfig-paths';
import { dynamicBase } from 'vite-plugin-dynamic-base';

export default defineConfig({
  plugins: [react(), tsconfigPaths(), dynamicBase({ transformIndexHtml: true })],
  test: {
    coverage: {
      enabled: true,
      include: ['./app/javascript/**/*.{js,jsx,ts,tsx}'],
      reportsDirectory: './coverage',
      reporter: ['text', 'lcov'],
      reportOnFailure: true,
    },
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./test/javascript/setupTests.ts'],
    testTimeout: 10000,
    reporters: [
      'default',
      ['junit', { outputFile: './test/reports/TEST-jest.xml' }],
      ['html', { outputFile: './test/html_reports/jest-report.html' }],
    ],
  },
  resolve: {
    mainFields: ['module'],
  },
});

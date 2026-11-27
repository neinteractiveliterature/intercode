// What the framework-mode build (vite.framework.config.mts) and the tests (vitest.config.mts) have in common. This is not a
// build of its own.
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { fileURLToPath } from 'url';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import { globalDefines } from './globalDefines.mts';

export function absolutePath(relativePath: string) {
  return fileURLToPath(new URL(relativePath, import.meta.url));
}

export function manualChunks(id: string) {
  const chunks: Array<[string, string[]]> = [
    ['apollo', ['@apollo/client', 'apollo-upload-client']],
    [
      'codemirror',
      [
        '@codemirror/state',
        '@codemirror/view',
        '@codemirror/language',
        '@codemirror/lang-html',
        '@codemirror/lang-json',
        '@codemirror/lang-markdown',
        '@lezer/common',
      ],
    ],
    ['currencyCodes', ['@breezehr/currency-codes']],
    ['graphql', ['graphql']],
    ['i18next', ['i18next', 'react-i18next']],
    ['lodash', ['lodash']],
    ['luxon', ['luxon']],
    ['reactRouter', ['react-router']],
  ];
  for (const [chunk, pkgs] of chunks) {
    if (pkgs.some((pkg) => id.includes(`/${pkg}/`) || id.includes(`/${pkg}@`))) {
      return chunk;
    }
  }
}

export const css = {
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
};

export default defineConfig({
  plugins: [
    react({
      // @swc/core 1.15.8 introduced a regression where it panics instead of silently discarding
      // missing source maps referenced by //# sourceMappingURL= comments in dependencies.
      // Remove this once a @swc/core release restores the documented "silently discarded" behavior.
      useAtYourOwnRisk_mutateSwcOptions: (options) => {
        options.inputSourceMap = false;
      },
    }),
    nodePolyfills(),
  ],
  resolve: {
    mainFields: ['module'],
    tsconfigPaths: true,
  },
  define: globalDefines,
  css,
});

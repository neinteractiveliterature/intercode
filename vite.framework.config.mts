import { defineConfig } from 'vite';
import { reactRouter } from '@react-router/dev/vite';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import { globalDefines } from './globalDefines.mts';
import { css, manualChunks } from './vite.config.mts';

// Framework-mode (react-router.config.ts) build, run with `yarn build:framework`. Kept apart from vite.config.mts so
// the production build is unaffected until the migration is ready to cut over.
export default defineConfig({
  plugins: [
    reactRouter(),
    // The polyfills are for the browser bundle; applied to the prerender (Node) build they replace node: modules
    { ...nodePolyfills(), applyToEnvironment: (environment) => environment.name === 'client' },
  ],
  resolve: {
    mainFields: ['module'],
    tsconfigPaths: true,
  },
  define: globalDefines,
  build: {
    copyPublicDir: false,
    rollupOptions: {
      output: { manualChunks },
    },
  },
  css,
});

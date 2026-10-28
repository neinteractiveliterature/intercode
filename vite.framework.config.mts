import { defineConfig } from 'vite';
import { reactRouter } from '@react-router/dev/vite';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import { globalDefines } from './globalDefines.mts';
import { css, manualChunks } from './vite.config.mts';
import routing from './terraform/modules/cloudfront_intercode/routing.json' with { type: 'json' };

// In development the Vite server stands in for CloudFront: SPA routes are served here and the paths Rails owns are
// proxied to it (the same list the CloudFront behaviors and nginx config come from).
const railsUrl = process.env.RAILS_URL ?? 'https://localhost:5050';
const railsPathPatterns = [...routing.rails_paths, ...routing.shell_paths].map((pattern) => {
  const escaped = pattern.replace(/[.*+?^${}()|[\]\\]/g, (char) => (char === '*' ? char : `\\${char}`));
  return pattern.endsWith('/*') ? `^${escaped.slice(0, -1)}` : `^${escaped}$`;
});

// Framework-mode (react-router.config.ts) build, run with `yarn build:framework` (or `yarn start:framework` for a
// development server that proxies Rails' paths to RAILS_URL, https://localhost:5050 by default). Kept apart from vite.config.mts so
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
  server: {
    port: 3136,
    proxy: Object.fromEntries(
      railsPathPatterns.map((pattern) => [
        pattern,
        {
          target: railsUrl,
          // The development server uses the self-signed certificates from dev_certificate.crt
          secure: false,
          // Rails picks the convention from the Host header and redirects to HTTPS in development
          headers: { host: process.env.INTERCODE_HOST ?? 'intercode.test', 'x-forwarded-proto': 'https' },
        },
      ]),
    ),
  },
});

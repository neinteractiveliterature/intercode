import { defineConfig } from 'vite';
import { reactRouter } from '@react-router/dev/vite';
import { readFileSync, existsSync } from 'fs';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import { globalDefines } from './globalDefines.mts';
import { absolutePath, css, manualChunks } from './vite.config.mts';
import routing from './terraform/modules/cloudfront_intercode/routing.json' with { type: 'json' };

// The framework build can't know the assets host: ASSETS_HOST is only set when the container starts. Every asset URL
// is built against this placeholder, and script/substituteAssetsHost.sh swaps in the real host (or nothing, for
// same-origin assets) when the assets image starts. Keep it in step with that script.
export const ASSETS_HOST_PLACEHOLDER = 'https://ASSETHOSTPLACEHOLDER.invalid/';

// In development the Vite server stands in for CloudFront: SPA routes are served here and the paths Rails owns are
// proxied to it (the same list the CloudFront behaviors and nginx config come from).
const railsUrl = process.env.RAILS_URL ?? 'https://localhost:5050';
const railsPathPatterns = [...routing.rails_paths, ...routing.shell_paths].map((pattern) => {
  const escaped = pattern.replace(/[.*+?^${}()|[\]\\]/g, (char) => (char === '*' ? char : `\\${char}`));
  // The proxy matches against the whole request URL, so an exact path has to allow for a query string
  return pattern.endsWith('/*') ? `^${escaped.slice(0, -1)}` : `^${escaped}(\\?.*)?$`;
});

// Rails serves HTTPS in development with this self-signed certificate, and the dev server uses it too, so that the OAuth
// redirect URIs and secure cookies work. Without the files (as in CI builds) it falls back to HTTP.
function devHttps() {
  const key = absolutePath('./dev_certificate.key');
  const cert = absolutePath('./dev_certificate.crt');
  if (!existsSync(key) || !existsSync(cert)) return undefined;
  return { key: readFileSync(key), cert: readFileSync(cert) };
}

// Framework-mode (react-router.config.ts) build, run with `yarn build:framework` (or `yarn start:framework` for a
// development server, run with `yarn start`, that proxies Rails' paths to RAILS_URL, https://localhost:5050 by default).
export default defineConfig(({ command, isPreview }) => ({
  base: command === 'build' ? ASSETS_HOST_PLACEHOLDER : '/',
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
    // FRONTEND_DEV_SERVER_PORT in .env.development tells Rails to look for the dev server here
    port: Number(process.env.FRONTEND_DEV_SERVER_PORT ?? 3135),
    strictPort: true,
    host: '0.0.0.0',
    allowedHosts: ['.intercode.test'],
    // Not for the preview server, which the build uses to prerender index.html over plain HTTP
    https: command === 'serve' && !isPreview ? devHttps() : undefined,
    // Other checkouts and build output inside the project directory would otherwise reload the page when they change
    watch: { ignored: ['**/.claude/**', `${absolutePath('./tmp')}/**`, `${absolutePath('./build')}/**`] },
    proxy: Object.fromEntries(
      railsPathPatterns.map((pattern) => [
        pattern,
        {
          target: railsUrl,
          // The Rails development server uses the same self-signed certificate
          secure: false,
          // The Host header is passed through unchanged, since Rails picks the convention from it
          headers: { 'x-forwarded-proto': 'https' },
        },
      ]),
    ),
  },
}));

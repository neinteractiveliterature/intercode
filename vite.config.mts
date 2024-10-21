import { defineConfig, Plugin, ProxyOptions, ViteDevServer } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import { reactRouter } from '@react-router/dev/vite';
import { fileURLToPath } from 'url';
// import { nodePolyfills } from 'vite-plugin-node-polyfills';
import { globalDefines } from './globalDefines.mts';
import morgan from 'morgan';
import { envOnlyMacros } from 'vite-env-only';
import { proxyPaths, getBackendUrl } from './app/javascript/proxyConfig';

export function absolutePath(relativePath: string) {
  return fileURLToPath(new URL(relativePath, import.meta.url));
}

// https://github.com/remix-run/remix/discussions/7850
function morganPlugin(): Plugin {
  return {
    name: 'morgan-plugin',
    configureServer(server: ViteDevServer) {
      return () => {
        server.middlewares.use(morgan('tiny'));
      };
    },
  };
}

function getProxyConfig() {
  let backendUrl: URL;
  try {
    backendUrl = getBackendUrl();
  } catch {
    return undefined;
  }

  return [...proxyPaths].reduce<Record<string, ProxyOptions>>(
    (memo, path) => ({
      ...memo,
      [path]: {
        target: backendUrl,
      },
    }),
    {},
  );
}

export default defineConfig({
  plugins: [
    tsconfigPaths(),
    morganPlugin(),
    // nodePolyfills(),
    envOnlyMacros(),
    !process.env.VITEST &&
      reactRouter({
        appDirectory: absolutePath('./app/javascript'),
        future: {},
      }),
  ],
  ssr: {
    noExternal: ['@neinteractiveliterature/litform', '@apollo/client', 'react-helmet-async'],
  },
  optimizeDeps: {
    exclude: ['node-fetch'],
  },
  resolve: {
    mainFields: ['module'],
  },
  define: globalDefines,
  experimental: {
    renderBuiltUrl: (filename, { hostType }) => {
      if (hostType !== 'js' || filename === 'setPublicPath.ts') {
        return { relative: true };
      } else {
        return { runtime: `window.__intercodeAssetURL(${JSON.stringify(filename)})` };
      }
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        // can't get import to work until Bootstrap supports it
        silenceDeprecations: ['import', 'legacy-js-api'],
        quietDeps: true,
      },
    },
  },
  build: {
    copyPublicDir: false,
    rollupOptions: {
      // tree shaking is causing empty GraphQL document constants as of Rollup 4.27,
      // hopefully can remove this eventually
      treeshake: false,
      input: {
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
          reactRouter: ['react-router'],
        },
      },
    },
  },
  css: {
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
    proxy: getProxyConfig(),
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

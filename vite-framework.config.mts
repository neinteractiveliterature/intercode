import { Plugin, ProxyOptions, UserConfig, ViteDevServer } from 'vite';
import { reactRouter } from '@react-router/dev/vite';
import morgan from 'morgan';
import { proxyPaths, getBackendUrl } from './app/javascript/proxyConfig';
import commonConfig from './viteConfigCommon';

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

export default {
  ...commonConfig,
  plugins: [...(commonConfig.plugins ?? []), morganPlugin(), !process.env.VITEST && reactRouter()],
  server: {
    ...commonConfig.server,
    proxy: getProxyConfig(),
  },
} satisfies UserConfig;

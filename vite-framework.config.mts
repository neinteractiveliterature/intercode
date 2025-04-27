import { defineConfig, Plugin, ProxyOptions, UserConfig, ViteDevServer } from 'vite';
import { reactRouter } from '@react-router/dev/vite';
import morgan from 'morgan';
import { proxyPaths, getBackendUrl } from './app/javascript/proxyConfig';
import commonConfig, { absolutePath } from './viteConfigCommon';

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

export default defineConfig(({ isSsrBuild }) => {
  return {
    ...commonConfig,
    build: {
      ...commonConfig.build,
      rollupOptions: {
        ...commonConfig.build?.rollupOptions,
        ...(isSsrBuild ? { input: absolutePath('./app/javascript/server/app.ts') } : {}),
      },
    },
    plugins: [...(commonConfig.plugins ?? []), !process.env.VITEST && reactRouter()],
    server: {
      ...commonConfig.server,
      proxy: getProxyConfig(),
    },
  };
});

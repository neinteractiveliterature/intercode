import { UserConfig, Plugin, transformWithEsbuild } from 'vite';
import reactSwc from '@vitejs/plugin-react-swc';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import commonConfig, { absolutePath } from './viteConfigCommon';
import { RouteConfigEntry } from '@react-router/dev/routes';
import { RouteObject } from 'react-router';

function browserRouterPlugin(): Plugin {
  function routeConfigEntryToRouteObject(configEntry: RouteConfigEntry): RouteObject {
    const { caseSensitive, file, children, id, index, path } = configEntry;

    if (index) {
      return {
        caseSensitive,
        id,
        index,
        lazy: routeModules[file],
        path,
      };
    }

    return {
      caseSensitive,
      children: children ? children.map(routeConfigEntryToRouteObject) : undefined,
      id,
      index,
      lazy: routeModules[file],
      path,
    };
  }

  return {
    name: 'react-router-library-mode-from-routes',
    async transform(code, id, options) {
      if (id === absolutePath('./app/javascript/routes.ts')) {
        const module = await import(id);
        console.log(module);
      }
    },
  };
}

export default {
  ...commonConfig,
  build: {
    ...commonConfig.build,
    rollupOptions: {
      ...commonConfig.build?.rollupOptions,
      input: {
        ...(commonConfig.build?.rollupOptions?.input as Record<string, string>),
        application: absolutePath('./app/javascript/packs/applicationEntry.ts'),
      },
    },
  },
  plugins: [...(commonConfig.plugins ?? []), nodePolyfills(), reactSwc(), browserRouterPlugin()],
} satisfies UserConfig;

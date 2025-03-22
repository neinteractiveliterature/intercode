import { UserConfig, Plugin, transformWithEsbuild } from 'vite';
import reactSwc from '@vitejs/plugin-react-swc';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import commonConfig, { absolutePath } from './viteConfigCommon';
import { RouteConfigEntry } from '@react-router/dev/routes';
import { build } from 'esbuild';

function browserRouterPlugin(routesFilePath: string): Plugin {
  function routeConfigEntryToRouteObject(configEntry: RouteConfigEntry): string {
    const { caseSensitive, file, children, id, index, path } = configEntry;

    if (index) {
      return `{
        caseSensitive: ${JSON.stringify(caseSensitive)},
        id: ${JSON.stringify(id)},
        index: ${JSON.stringify(index)},
        lazy: async () => { const { default: defaultExport, ...other } = await import(${JSON.stringify(file)}); return { Component: defaultExport, ...other }; },
        path: ${JSON.stringify(path)},
      }`;
    }

    return `{
      caseSensitive: ${JSON.stringify(caseSensitive)},
      children: ${children ? '[' + children.map(routeConfigEntryToRouteObject).join(',') + ']' : 'undefined'},
      id: ${JSON.stringify(id)},
      index: ${JSON.stringify(index)},
      lazy: async () => { const { default: defaultExport, ...other } = await import(${JSON.stringify(file)}); return { Component: defaultExport, ...other }; },
      path: ${JSON.stringify(path)},
    }`;
  }

  return {
    name: 'react-router-library-mode-from-routes',
    async transform(code, id, options) {
      if (id === routesFilePath) {
        const buildResult = await build({
          bundle: true,
          format: 'cjs',
          entryPoints: [id],
          write: false,
        });
        const transformedCode = buildResult.outputFiles
          ?.map((file) => Buffer.from(file.contents).toString('utf-8'))
          .join('\n');
        const result = (0, eval)(`var module = {};\n${transformedCode}\nmodule`);
        const routeConfigEntries = result.exports.default;
        const routeObjects = routeConfigEntries.map(routeConfigEntryToRouteObject).join('\n');

        return `export const NamedRoute = ${JSON.stringify(result.exports.NamedRoute)};\n\nconst routes = ${routeObjects};\n\nexport default routes;`;
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
  plugins: [
    ...(commonConfig.plugins ?? []),
    nodePolyfills(),
    reactSwc(),
    browserRouterPlugin(absolutePath('./app/javascript/routes.ts')),
  ],
} satisfies UserConfig;

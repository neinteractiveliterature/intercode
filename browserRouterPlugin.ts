import { RouteConfigEntry } from '@react-router/dev/routes';
import { build } from 'esbuild';
import { RouteObject } from 'react-router';
import { Plugin } from 'vite';

export function browserRouterPlugin(routesFilePath: string): Plugin {
  function routeConfigEntryToRouteObjectWithoutChildrenAndLazy(
    configEntry: RouteConfigEntry,
  ): Omit<RouteObject, 'children' | 'lazy'> {
    const { caseSensitive, id, index, path } = configEntry;

    return {
      caseSensitive,
      id,
      index,
      path,
    };
  }

  function getLazyFunctionForRouteConfigEntry(configEntry: RouteConfigEntry) {
    const { file } = configEntry;
    return `async () => {
          const { default: defaultExport, ...other } = await import(${JSON.stringify(file)});
          return { Component: defaultExport, ...other };
        }`;
  }

  function routeConfigEntryToRouteObject(configEntry: RouteConfigEntry): string {
    const { children, index } = configEntry;
    const base = routeConfigEntryToRouteObjectWithoutChildrenAndLazy(configEntry);
    const lazy = getLazyFunctionForRouteConfigEntry(configEntry);

    if (index) {
      return `{
        ...(${JSON.stringify(base)}),
        lazy: ${lazy},
      }`;
    }

    return `{
      ...(${JSON.stringify(base)}),
      lazy: ${lazy},
      children: ${children ? '[' + children.map(routeConfigEntryToRouteObject).join(',') + ']' : 'undefined'},
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

        const otherExports = Object.entries(result.exports)
          .filter(([key]) => key !== 'default')
          .map(([key, value]) => {
            if (typeof value === 'function') {
              return `export const ${key} = ${value.toString()};`;
            }
            return `export const ${key} = ${JSON.stringify(value)};`;
          })
          .join('\n');

        return `${otherExports}\n\nconst routes = ${routeObjects};\n\nexport default routes;`;
      }
    },
  };
}

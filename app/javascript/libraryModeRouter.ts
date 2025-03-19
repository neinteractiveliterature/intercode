import { RouteConfigEntry } from '@react-router/dev/routes';
import { createBrowserRouter, RouteObject } from 'react-router';
import routes from './routes';

function collectFilePaths(config: RouteConfigEntry[]): string[] {
  return config.flatMap((entry) => [`./${entry.file}`, ...collectFilePaths(entry.children ?? [])]);
}

const routeModules = {};

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

export function buildLibraryModeBrowserRouter() {
  return createBrowserRouter(routes.map(routeConfigEntryToRouteObject));
}

import type { RouteObject } from 'react-router';

// Route modules name their exports the way React Router framework mode expects (default for the component, clientLoader,
// clientAction), but the data-mode router in AppRouter.tsx still wants Component, loader and action. This renames them as
// the module loads. It goes away when AppRouter.tsx is replaced by routes.ts.
type ClientRouteExports = {
  default?: RouteObject['Component'];
  clientLoader?: RouteObject['loader'];
  clientAction?: RouteObject['action'];
};

export function renameClientExports<M extends object>(routeModule: M) {
  const { default: Component, clientLoader, clientAction, ...rest } = routeModule as M & ClientRouteExports;
  return {
    ...rest,
    ...(Component ? { Component } : {}),
    ...(clientLoader ? { loader: clientLoader } : {}),
    ...(clientAction ? { action: clientAction } : {}),
  };
}

export function lazyRoute<M extends object>(load: () => Promise<M>) {
  return async () => renameClientExports(await load());
}

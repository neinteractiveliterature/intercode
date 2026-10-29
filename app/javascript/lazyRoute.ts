import type { RouteObject } from 'react-router';

// Route modules name their data functions the way React Router framework mode expects (clientLoader, clientAction), but
// the data-mode router in AppRouter.tsx still wants loader and action. This renames them as the module loads. It goes
// away when AppRouter.tsx is replaced by routes.ts.
type ClientRouteExports = {
  clientLoader?: RouteObject['loader'];
  clientAction?: RouteObject['action'];
};

export function lazyRoute<M extends object>(load: () => Promise<M>) {
  return async () => {
    const { clientLoader, clientAction, ...rest } = (await load()) as M & ClientRouteExports;
    return {
      ...rest,
      ...(clientLoader ? { loader: clientLoader } : {}),
      ...(clientAction ? { action: clientAction } : {}),
    };
  };
}

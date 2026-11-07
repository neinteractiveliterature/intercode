import 'regenerator-runtime/runtime';

import mountReactComponents from '../mountReactComponents';
import { StrictMode, Suspense, use, useMemo, useSyncExternalStore } from 'react';
import { createBrowserRouter, RouterProvider, RouteObject } from 'react-router';
import { startAppBootstrap, buildRouterContext } from 'appBootstrap';
import { appRootRoutes } from 'AppRouter';
import { AuthenticationManagerContext } from '../Authentication/authenticationManager';
import { PageLoadingIndicator } from '@neinteractiveliterature/litform';
import { checkAppEntrypointHeadersOnError } from '../checkAppEntrypointHeadersMatch';
import BootErrorBoundary from '../BootErrorBoundary';
import { lazyRoute } from '../lazyRoute';

const bootstrapPromise = startAppBootstrap();

// Wrap every route's lazy import so a failed chunk load — almost always a stale
// deploy whose hashed chunk no longer exists — reloads onto the fresh bundle
// instead of surfacing as an unrecoverable blank. Applied once to the whole tree.
function withEntrypointReloadOnLazy(routes: RouteObject[]): RouteObject[] {
  return routes.map((route) => {
    let { lazy } = route;
    if (typeof lazy === 'function') {
      const load = lazy;
      lazy = () => checkAppEntrypointHeadersOnError(load);
    }
    return {
      ...route,
      lazy,
      children: route.children ? withEntrypointReloadOnLazy(route.children) : route.children,
    } as RouteObject;
  });
}

// DataModeApplicationEntry gates RouterProvider on router.state.initialized.
//
// RouterProvider uses useState(router.state) for its initial state. If the
// router's initial navigation hasn't finished yet (initialized=false,
// renderFallback=true), RouterProvider renders null and then must use
// startTransition to escape that null state when the router fires. During
// that transition the DOM stays empty. Waiting until the router is initialized
// before mounting RouterProvider ensures useState captures initialized=true
// from the start, so RouterProvider renders content immediately.
function DataModeApplicationEntry() {
  const bootstrap = use(bootstrapPromise);

  const router = useMemo(
    () =>
      createBrowserRouter(
        withEntrypointReloadOnLazy([
          {
            id: 'root',
            lazy: lazyRoute(() => import('AppRootProviders')),
            children: appRootRoutes,
          },
        ]),
        {
          getContext: () => buildRouterContext(bootstrap),
        },
      ),
    [bootstrap],
  );

  // Gate on router initialization so RouterProvider always mounts with
  // initialized=true.  This has to read the router's current state when it subscribes (which useSyncExternalStore
  // does): React Router 8's subscribe() doesn't replay past state to new subscribers like 7.x did, so a router that
  // finished initializing before we subscribed would otherwise leave us on the loading indicator forever.
  const routerReady = useSyncExternalStore(
    (onStoreChange) => router.subscribe(onStoreChange),
    () => router.state.initialized,
  );

  if (!routerReady) {
    return <PageLoadingIndicator visible />;
  }

  return (
    <StrictMode>
      <AuthenticationManagerContext.Provider value={bootstrap.authManager}>
        <RouterProvider router={router} />
      </AuthenticationManagerContext.Provider>
    </StrictMode>
  );
}

function DataModeApplicationEntrySuspenseWrapper() {
  return (
    <BootErrorBoundary>
      <Suspense fallback={<PageLoadingIndicator visible />}>
        <DataModeApplicationEntry />
      </Suspense>
    </BootErrorBoundary>
  );
}

mountReactComponents({ AppRoot: DataModeApplicationEntrySuspenseWrapper });

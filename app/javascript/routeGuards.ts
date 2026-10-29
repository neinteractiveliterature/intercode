import { LoaderFunction, LoaderFunctionArgs, RouterContextProvider } from 'react-router';
import { appRootDataContext } from 'AppContexts';
import { AbilityName } from './Authentication/useAuthorizationRequired';
import { AppRootQueryData } from './appRootQueries.generated';

// Guards for routes, which use the app root data that appRootMiddleware has put in the router context. They throw a
// Response (401, 403 or 404), which RouteErrorBoundary renders.
//
// They run as loaders (see guarded) rather than as middleware. React Router renders an error from middleware at the
// shallowest route that still has data to load, which on a page load is the root route, and that has no
// ErrorBoundary: so the error showed as "No result returned from dataStrategy for route root" instead of the login
// prompt or the not-authorized page. An error from a loader goes to the nearest ErrorBoundary above the route.

export type RouteGuard = (args: LoaderFunctionArgs<RouterContextProvider>) => void;

export function makeAppRootContextGuard(guard: (data: AppRootQueryData) => boolean): RouteGuard {
  return ({ context }) => {
    const appRootData = context.get(appRootDataContext);
    if (appRootData != null && !guard(appRootData)) {
      throw new Response(null, { status: 404 });
    }
  };
}

export const loginRequiredGuard: RouteGuard = ({ context }) => {
  const appRootData = context.get(appRootDataContext);
  if (appRootData == null) return;
  if (!appRootData.currentUser) {
    throw new Response(null, { status: 401 });
  }
};

export function makeAuthorizationGuard(...abilities: AbilityName[]): RouteGuard {
  return ({ context }) => {
    const appRootData = context.get(appRootDataContext);
    if (appRootData == null) return;
    if (!appRootData.currentUser) {
      throw new Response(null, { status: 401 });
    }
    if (!abilities.every((ability) => appRootData.currentAbility[ability])) {
      throw new Response(null, { status: 403 });
    }
  };
}

// A loader that runs the guards, then the route's own loader if it has one, so that loader doesn't start when a guard
// fails. A route's children's loaders are not held back (React Router runs them alongside this one).
export function guarded(
  guards: RouteGuard[],
  loader?: LoaderFunction<RouterContextProvider>,
): LoaderFunction<RouterContextProvider> {
  return (args, handlerCtx) => {
    guards.forEach((guard) => guard(args));
    return loader ? loader(args, handlerCtx) : null;
  };
}

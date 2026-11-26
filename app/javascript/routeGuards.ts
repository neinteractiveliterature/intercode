import { LoaderFunctionArgs, redirect, RouterContextProvider } from 'react-router';
import { appRootDataContext } from 'AppContexts';
import { AbilityName } from './Authentication/useAuthorizationRequired';
import { AppRootQueryData } from './appRootQueries.generated';
import { SiteMode } from './graphqlTypes.generated';

// Guards for routes, which await the app root data that appRootMiddleware has put in the router context. They throw a
// Response: a 401, 403 or 404, which RouteErrorBoundary renders, or a redirect.
//
// They run as loaders (see guarded) rather than as middleware. React Router renders an error from middleware at the
// shallowest route that still has data to load, which on a page load is the root route, and that has no
// ErrorBoundary: so the error showed as "No result returned from dataStrategy for route root" instead of the login
// prompt or the not-authorized page. An error from a loader goes to the nearest ErrorBoundary above the route.
// Redirects are here too, because waiting for the data in middleware would hold back every loader on the page.

export type RouteGuard = (args: LoaderFunctionArgs<RouterContextProvider>) => Promise<void>;

type LoaderWithGuardArgs<Result> = (args: LoaderFunctionArgs<RouterContextProvider>) => Result | Promise<Result>;

export function makeAppRootContextGuard(guard: (data: AppRootQueryData) => boolean): RouteGuard {
  return async ({ context }) => {
    const appRootData = await context.get(appRootDataContext);
    if (appRootData != null && !guard(appRootData)) {
      throw new Response(null, { status: 404 });
    }
  };
}

export const loginRequiredGuard: RouteGuard = async ({ context }) => {
  const appRootData = await context.get(appRootDataContext);
  if (appRootData == null) return;
  if (!appRootData.currentUser) {
    throw new Response(null, { status: 401 });
  }
};

export function makeAuthorizationGuard(...abilities: AbilityName[]): RouteGuard {
  return async ({ context }) => {
    const appRootData = await context.get(appRootDataContext);
    if (appRootData == null) return;
    if (!appRootData.currentUser) {
      throw new Response(null, { status: 401 });
    }
    if (!abilities.every((ability) => appRootData.currentAbility[ability])) {
      throw new Response(null, { status: 403 });
    }
  };
}

export const eventPageGuard: RouteGuard = async ({ context }) => {
  const appRootData = await context.get(appRootDataContext);
  if (appRootData?.convention?.site_mode === SiteMode.SingleEvent) {
    throw redirect('/');
  }
};

export const editEventGuard: RouteGuard = async ({ context }) => {
  const appRootData = await context.get(appRootDataContext);
  if (appRootData?.convention?.site_mode === SiteMode.SingleEvent) {
    throw redirect('/admin_events');
  }
};

// A loader that runs the guards, then the route's own loader if it has one, so that loader doesn't start when a guard
// fails. A route's children's loaders are not held back (React Router runs them alongside this one).
export function guarded<Result = null>(
  guards: RouteGuard[],
  loader?: LoaderWithGuardArgs<Result>,
): LoaderWithGuardArgs<Result | null> {
  return async (args) => {
    // one at a time, so that the first guard in the list to fail decides what happens
    for (const guard of guards) {
      await guard(args);
    }
    return loader ? loader(args) : null;
  };
}

import { MiddlewareFunction, redirect } from 'react-router';
import { appRootDataContext } from 'AppContexts';
import { SiteMode } from './graphqlTypes.generated';

// Middleware that redirects using the app root data, which appRootMiddleware has put in the router context. (Guards that
// reject a request are in routeGuards.ts: they can't be middleware.)

export const eventPageMiddleware: MiddlewareFunction = ({ context }) => {
  const appRootData = context.get(appRootDataContext);
  if (appRootData?.convention?.site_mode === SiteMode.SingleEvent) {
    return redirect('/');
  }
};

export const editEventMiddleware: MiddlewareFunction = ({ context }) => {
  const appRootData = context.get(appRootDataContext);
  if (appRootData?.convention?.site_mode === SiteMode.SingleEvent) {
    return redirect('/admin_events');
  }
};

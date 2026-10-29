import { MiddlewareFunction, redirect } from 'react-router';
import { appRootDataContext } from 'AppContexts';
import { SiteMode } from './graphqlTypes.generated';
import { AbilityName } from './Authentication/useAuthorizationRequired';
import { AppRootQueryData } from './appRootQueries.generated';

// Middleware that guards routes using the app root data, which appRootMiddleware has put in the router context.

export function makeAppRootContextMiddleware(guard: (data: AppRootQueryData) => boolean): MiddlewareFunction {
  return ({ context }) => {
    const appRootData = context.get(appRootDataContext);
    if (appRootData != null && !guard(appRootData)) {
      return new Response(null, { status: 404 });
    }
  };
}

export const loginRequiredMiddleware: MiddlewareFunction = ({ context }) => {
  const appRootData = context.get(appRootDataContext);
  if (appRootData == null) return;
  if (!appRootData.currentUser) {
    return new Response(null, { status: 401 });
  }
};

export function makeAuthorizationMiddleware(...abilities: AbilityName[]): MiddlewareFunction {
  return ({ context }) => {
    const appRootData = context.get(appRootDataContext);
    if (appRootData == null) return;
    if (!appRootData.currentUser) {
      return new Response(null, { status: 401 });
    }
    if (!abilities.every((ability) => appRootData.currentAbility[ability])) {
      return new Response(null, { status: 403 });
    }
  };
}

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

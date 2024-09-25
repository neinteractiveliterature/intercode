import { NamedRoute } from 'routes';
import { Route, Info } from './+types/route';
import { EventCategoryAdminQueryDocument } from './queries.generated';
import { Outlet, useRouteLoaderData } from 'react-router';
import useAuthorizationRequired from 'Authentication/useAuthorizationRequired';
import { useContext } from 'react';

import AppRootContext from 'AppRootContext';
import { SiteMode } from 'graphqlTypes.generated';
import FourOhFourPage from 'FourOhFourPage';

export async function loader({ context }: Route.LoaderArgs) {
  const { data } = await context.client.query({ query: EventCategoryAdminQueryDocument });
  return data;
}

export function useEventCategoryAdminLoader() {
  return useRouteLoaderData(NamedRoute.EventCategoryAdmin) as Info['loaderData'];
}

export default function EventCategoryAdmin() {
  const { siteMode } = useContext(AppRootContext);
  const replacementContent = useAuthorizationRequired('can_update_event_categories');

  if (siteMode === SiteMode.SingleEvent) {
    return <FourOhFourPage />;
  }

  if (replacementContent) {
    return replacementContent;
  }

  return <Outlet />;
}

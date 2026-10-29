import { LoaderFunction, redirect, RouterContextProvider, useRouteLoaderData } from 'react-router';
import { apolloClientContext } from 'AppContexts';
import { EventAdminEventsQueryData, EventAdminEventsQueryDocument } from './queries.generated';
import { NamedRoute } from '../NamedRoute';
import { SiteMode } from '../graphqlTypes.generated';
import buildEventCategoryUrl from './buildEventCategoryUrl';

export const eventAdminEventsLoader: LoaderFunction<RouterContextProvider> = async ({ context }) => {
  const client = context.get(apolloClientContext);
  const { data } = await client.query<EventAdminEventsQueryData>({ query: EventAdminEventsQueryDocument });
  return data;
};

export function useEventAdminEventsLoader() {
  return useRouteLoaderData(NamedRoute.EventAdmin) as EventAdminEventsQueryData;
}

export const eventAdminRootRedirect: LoaderFunction<RouterContextProvider> = async ({ context }) => {
  const client = context.get(apolloClientContext);
  const { data } = await client.query({ query: EventAdminEventsQueryDocument });
  const convention = data?.convention;
  if (!convention) {
    return new Response(null, { status: 404 });
  }

  if (convention.site_mode === SiteMode.SingleEvent) {
    if (convention.events.length === 0) {
      return redirect('./new');
    } else {
      return redirect(`./${convention.events[0].id}/edit`);
    }
  }

  const firstEventCategory = convention.event_categories[0];
  if (!firstEventCategory) {
    return new Response(null, { status: 404 });
  }

  return redirect(buildEventCategoryUrl(firstEventCategory));
};

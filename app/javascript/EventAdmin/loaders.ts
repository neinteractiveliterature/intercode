import { LoaderFunctionArgs, redirect } from 'react-router';
import { apolloClientContext } from 'AppContexts';
import { EventAdminEventsQueryDocument } from './queries.generated';
import { NamedRoute } from '../NamedRoute';
import useRequiredRouteLoaderData from '../useRequiredRouteLoaderData';
import { SiteMode } from '../graphqlTypes.generated';
import buildEventCategoryUrl from './buildEventCategoryUrl';

export const eventAdminEventsLoader = async ({ context }: LoaderFunctionArgs) => {
  const client = context.get(apolloClientContext);
  const { data } = await client.query({ query: EventAdminEventsQueryDocument, errorPolicy: 'none' });
  return data;
};

export function useEventAdminEventsLoader() {
  return useRequiredRouteLoaderData<typeof eventAdminEventsLoader>(NamedRoute.EventAdmin);
}

export const eventAdminRootRedirect = async ({ context }: LoaderFunctionArgs) => {
  const client = context.get(apolloClientContext);
  const { data } = await client.query({ query: EventAdminEventsQueryDocument, errorPolicy: 'none' });
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

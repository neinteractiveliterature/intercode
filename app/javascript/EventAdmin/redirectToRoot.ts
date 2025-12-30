import { LoaderFunction, RouterContextProvider, redirect } from 'react-router';
import { apolloClientContext } from '~/AppContexts';
import { EventAdminEventsQueryDocument } from './queries.generated';
import { SiteMode } from '../graphqlTypes.generated';
import buildEventCategoryUrl from './buildEventCategoryUrl';

export const clientLoader: LoaderFunction<RouterContextProvider> = async ({ context }) => {
  const client = context.get(apolloClientContext);
  const { data } = await client.query({ query: EventAdminEventsQueryDocument });
  const convention = data?.convention;
  if (!convention) {
    return new Response(null, { status: 404 });
  }

  if (convention.site_mode === SiteMode.SingleEvent) {
    if (convention.events.length === 0) {
      return redirect('./new');
    }
    const eventId = convention.events[0].id;
    return redirect(`./${eventId}/edit`);
  }

  if (convention.event_categories.length === 0) {
    return new Response(null, { status: 404 });
  }

  return redirect(buildEventCategoryUrl(convention.event_categories[0]));
};

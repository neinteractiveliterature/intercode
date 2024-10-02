import { redirect } from '@remix-run/react';
import buildEventCategoryUrl from 'EventAdmin/buildEventCategoryUrl';
import { EventAdminEventsQueryDocument } from 'EventAdmin/queries.generated';
import { SiteMode } from 'graphqlTypes.generated';
import { LoaderFunction } from 'react-router';
import { buildServerApolloClient } from 'serverApolloClient.server';

const eventAdminRootRedirect: LoaderFunction = async ({ request }) => {
  const client = buildServerApolloClient(request);
  const { data } = await client.query({ query: EventAdminEventsQueryDocument });
  if (!data.convention) {
    return new Response(null, { status: 404 });
  }

  if (data.convention.site_mode === SiteMode.SingleEvent) {
    if (data.convention.events.length === 0) {
      return redirect('./new');
    } else {
      return redirect(`./${data.convention.events[0].id}/edit`);
    }
  }

  const firstEventCategory = data.convention.event_categories[0];
  if (!firstEventCategory) {
    return new Response(null, { status: 404 });
  }

  return redirect(buildEventCategoryUrl(firstEventCategory));
};

export default eventAdminRootRedirect;

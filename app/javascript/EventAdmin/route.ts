import { redirect } from 'react-router';
import buildEventCategoryUrl from 'EventAdmin/buildEventCategoryUrl';
import { SiteMode } from 'graphqlTypes.generated';
import { Route } from './+types/route';
import { EventAdminRootQueryDocument } from './queries.generated';

export async function loader({ context }: Route.LoaderArgs) {
  const client = context.client;
  const { data } = await client.query({ query: EventAdminRootQueryDocument });
  if (!data.convention) {
    return new Response(null, { status: 404 });
  }

  if (data.convention.site_mode === SiteMode.SingleEvent) {
    if (data.convention.events_paginated.total_entries === 0) {
      return redirect('./new');
    } else {
      return redirect(`./${data.convention.events_paginated.entries[0].id}/edit`);
    }
  }

  const firstEventCategory = data.convention.event_categories[0];
  if (!firstEventCategory) {
    return new Response(null, { status: 404 });
  }

  return redirect(buildEventCategoryUrl(firstEventCategory));
}

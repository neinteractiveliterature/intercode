import { useRouteLoaderData } from 'react-router';
import { apolloClientContext } from '~/AppContexts';
import { EventAdminEventsQueryData, EventAdminEventsQueryDocument } from './queries.generated';
import { NamedRoute } from '~/routes';
import { Route } from './+types/route';

export const eventAdminEventsLoader = async ({ context }: Route.ClientLoaderArgs) => {
  const client = context.get(apolloClientContext);
  const { data } = await client.query({ query: EventAdminEventsQueryDocument });
  return data;
};

export function useEventAdminEventsLoader() {
  return useRouteLoaderData(NamedRoute.EventAdmin) as EventAdminEventsQueryData;
}

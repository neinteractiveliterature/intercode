import { LoaderFunction, RouterContextProvider, useRouteLoaderData } from 'react-router';
import { apolloClientContext } from 'AppContexts';
import { EventAdminEventsQueryData, EventAdminEventsQueryDocument } from './queries.generated';
import { NamedRoute } from '../AppRouter';

export const eventAdminEventsLoader: LoaderFunction<RouterContextProvider> = async ({ context }) => {
  const client = context.get(apolloClientContext);
  const { data } = await client.query<EventAdminEventsQueryData>({ query: EventAdminEventsQueryDocument });
  return data;
};

export function useEventAdminEventsLoader() {
  return useRouteLoaderData(NamedRoute.EventAdmin) as EventAdminEventsQueryData;
}

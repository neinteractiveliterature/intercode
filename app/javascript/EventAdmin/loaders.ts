import { LoaderFunction, useRouteLoaderData } from 'react-router';
import { client } from '../useIntercodeApolloClient';
import { EventAdminEventsQueryData, EventAdminEventsQueryDocument } from './queries.generated';
import { NamedRoute } from '../routes';

export const eventAdminEventsLoader: LoaderFunction = async () => {
  const { data } = await client.query<EventAdminEventsQueryData>({ query: EventAdminEventsQueryDocument });
  return data;
};

export function useEventAdminEventsLoader() {
  return useRouteLoaderData(NamedRoute.EventAdmin) as EventAdminEventsQueryData;
}

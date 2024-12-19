import { NamedRoute } from 'routes';
import { Route, Info } from './+types/route';
import { EventCategoryAdminQueryDocument } from './queries.generated';
import { useRouteLoaderData } from 'react-router';

export async function loader({ context }: Route.LoaderArgs) {
  const { data } = await context.client.query({ query: EventCategoryAdminQueryDocument });
  return data;
}

export function useEventCategoryAdminLoader() {
  return useRouteLoaderData(NamedRoute.EventCategoryAdmin) as Info['loaderData'];
}

import { useRouteLoaderData } from 'react-router';
import { CmsLayoutsAdminQueryDocument } from './queries.generated';
import { NamedRoute } from '../../routes';
import { Route, Info } from './+types/route';

export async function loader({ context }: Route.LoaderArgs) {
  const { data } = await context.client.query({ query: CmsLayoutsAdminQueryDocument });
  return data;
}

export function useCmsLayoutsAdminLoader() {
  return useRouteLoaderData(NamedRoute.CmsLayoutsAdmin) as Info['loaderData'];
}

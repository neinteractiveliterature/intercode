import { useRouteLoaderData } from 'react-router';
import { CmsContentGroupsAdminQueryDocument } from './queries.generated';
import { NamedRoute } from '../../routes';
import { Route, Info } from './+types/route';

export async function loader({ context }: Route.LoaderArgs) {
  const { data } = await context.client.query({ query: CmsContentGroupsAdminQueryDocument });
  return data;
}

export function useCmsContentGroupsAdminLoader() {
  return useRouteLoaderData(NamedRoute.CmsContentGroupsAdmin) as Info['loaderData'];
}

import { useRouteLoaderData } from 'react-router';
import { CmsContentGroupsAdminQueryDocument } from './queries.generated';
import { NamedRoute } from '../../routes';
import { Route, Info } from './+types/route';
import { apolloClientContext } from 'AppContexts';

export async function loader({ context }: Route.LoaderArgs) {
  const { data } = await context.get(apolloClientContext).query({ query: CmsContentGroupsAdminQueryDocument });
  return data;
}

export function useCmsContentGroupsAdminLoader() {
  return useRouteLoaderData(NamedRoute.CmsContentGroupsAdmin) as Info['loaderData'];
}

import { useRouteLoaderData } from 'react-router';
import { Route, Info } from './+types/route';
import { CmsPagesAdminQueryDocument } from './queries.generated';
import { NamedRoute } from 'routes';
import { apolloClientContext } from 'AppContexts';

export async function loader({ context }: Route.LoaderArgs) {
  const { data } = await context.get(apolloClientContext).query({ query: CmsPagesAdminQueryDocument });
  return data;
}

export function useCmsPagesAdminLoader() {
  return useRouteLoaderData(NamedRoute.CmsPagesAdmin) as Info['loaderData'];
}

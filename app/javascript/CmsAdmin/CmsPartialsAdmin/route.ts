import { CmsPartialsAdminQueryDocument } from './queries.generated';
import { Route, Info } from './+types/route';
import { NamedRoute } from 'routes';
import { useRouteLoaderData } from 'react-router';
import { apolloClientContext } from 'AppContexts';

export async function loader({ context }: Route.LoaderArgs) {
  const { data } = await context.get(apolloClientContext).query({ query: CmsPartialsAdminQueryDocument });
  return data;
}

export function useCmsPartialsAdminLoader() {
  return useRouteLoaderData(NamedRoute.CmsPartialsAdmin) as Info['loaderData'];
}

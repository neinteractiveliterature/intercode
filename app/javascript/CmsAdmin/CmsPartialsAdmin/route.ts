import { CmsPartialsAdminQueryDocument } from './queries.generated';
import { Route, Info } from './+types/route';
import { NamedRoute } from 'routes';
import { useRouteLoaderData } from 'react-router';

export async function loader({ context }: Route.LoaderArgs) {
  const { data } = await context.client.query({ query: CmsPartialsAdminQueryDocument });
  return data;
}

export function useCmsPartialsAdminLoader() {
  return useRouteLoaderData(NamedRoute.CmsPartialsAdmin) as Info['loaderData'];
}

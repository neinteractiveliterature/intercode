import { useRouteLoaderData } from 'react-router';
import { CmsGraphqlQueriesQueryDocument } from './queries.generated';
import { NamedRoute } from '../../routes';
import { Route, Info } from './+types/route';
import { apolloClientContext } from 'AppContexts';

export async function loader({ context }: Route.LoaderArgs) {
  const { data } = await context.get(apolloClientContext).query({ query: CmsGraphqlQueriesQueryDocument });
  return data;
}

export function useCmsGraphqlQueriesAdminLoader() {
  return useRouteLoaderData(NamedRoute.CmsGraphqlQueriesAdmin) as Info['loaderData'];
}

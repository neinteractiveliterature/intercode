import { DepartmentAdminQueryDocument } from './queries.generated';
import { Route } from './+types/route';
import { NamedRoute } from 'routes';
import { useRouteLoaderData } from 'react-router';
import { apolloClientContext } from 'AppContexts';

export async function loader({ context }: Route.LoaderArgs) {
  const { data } = await context.get(apolloClientContext).query({ query: DepartmentAdminQueryDocument });
  return data;
}

export function useDepartmentAdminLoader() {
  return useRouteLoaderData(NamedRoute.DepartmentAdmin) as Route.ComponentProps['loaderData'];
}

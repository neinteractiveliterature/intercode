import { DepartmentAdminQueryDocument } from './queries.generated';
import { Route } from './+types/route';
import { NamedRoute } from 'routes';
import { useRouteLoaderData } from 'react-router';

export async function loader({ context }: Route.LoaderArgs) {
  const { data } = await context.client.query({ query: DepartmentAdminQueryDocument });
  return data;
}

export function useDepartmentAdminLoader() {
  return useRouteLoaderData(NamedRoute.DepartmentAdmin) as Route.ComponentProps['loaderData'];
}

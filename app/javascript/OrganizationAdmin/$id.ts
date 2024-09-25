import { useRouteLoaderData } from 'react-router';
import { Route, Info } from './+types/$id';
import { OrganizationAdminOrganizationQueryDocument } from './queries.generated';
import { NamedRoute } from 'routes';

export async function loader({ context, params: { id } }: Route.LoaderArgs) {
  const { data } = await context.client.query({ query: OrganizationAdminOrganizationQueryDocument, variables: { id } });
  return data;
}

export function useOrganizationLoaderData() {
  const data = useRouteLoaderData(NamedRoute.Organization) as Info['loaderData'];
  return data;
}

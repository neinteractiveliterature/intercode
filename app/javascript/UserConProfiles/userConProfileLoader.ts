import { UserConProfileAdminQueryDocument } from './queries.generated';
import { Route, Info } from './+types/userConProfileLoader';
import { useRouteLoaderData } from 'react-router';
import { NamedRoute } from 'routes';

export async function loader({ params: { id }, context }: Route.LoaderArgs) {
  const { data } = await context.client.query({
    query: UserConProfileAdminQueryDocument,
    variables: { id },
  });
  return data;
}

export function useUserConProfileLoaderData() {
  return useRouteLoaderData(NamedRoute.AdminUserConProfile) as Info['loaderData'];
}

import { useRouteLoaderData } from 'react-router';
import { apolloClientContext } from '~/AppContexts';
import { CmsAdminBaseQueryData, CmsAdminBaseQueryDocument } from './queries.generated';
import { NamedRoute } from '../AppRouter';
import { Route } from './+types/route';

export const cmsAdminBaseQueryLoader = async ({ context }: Route.ClientLoaderArgs) => {
  const client = context.get(apolloClientContext);
  const { data } = await client.query({ query: CmsAdminBaseQueryDocument });
  return data;
};

export function useCmsAdminBaseQueryLoader() {
  return useRouteLoaderData(NamedRoute.CmsAdmin) as CmsAdminBaseQueryData;
}

import { LoaderFunction, RouterContextProvider, useRouteLoaderData } from 'react-router';
import { apolloClientContext } from 'AppContexts';
import { CmsAdminBaseQueryData, CmsAdminBaseQueryDocument } from './queries.generated';
import { NamedRoute } from '../AppRouter';

export const cmsAdminBaseQueryLoader: LoaderFunction<RouterContextProvider> = async ({ context }) => {
  const client = context.get(apolloClientContext);
  const { data } = await client.query<CmsAdminBaseQueryData>({ query: CmsAdminBaseQueryDocument });
  return data;
};

export function useCmsAdminBaseQueryLoader() {
  return useRouteLoaderData(NamedRoute.CmsAdmin) as CmsAdminBaseQueryData;
}

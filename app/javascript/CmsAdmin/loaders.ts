import { LoaderFunction, useRouteLoaderData } from 'react-router';
import { client } from '../useIntercodeApolloClient';
import { CmsAdminBaseQueryData, CmsAdminBaseQueryDocument } from './queries.generated';
import { NamedRoute } from '../routes';

export const cmsAdminBaseQueryLoader: LoaderFunction = async () => {
  const { data } = await client.query<CmsAdminBaseQueryData>({ query: CmsAdminBaseQueryDocument });
  return data;
};

export function useCmsAdminBaseQueryLoader() {
  return useRouteLoaderData(NamedRoute.CmsAdmin) as CmsAdminBaseQueryData;
}

import { LoaderFunctionArgs } from 'react-router';
import { apolloClientContext } from 'AppContexts';
import { CmsAdminBaseQueryDocument } from './queries.generated';
import { NamedRoute } from '../NamedRoute';
import useRequiredRouteLoaderData from '../useRequiredRouteLoaderData';

export const cmsAdminBaseQueryLoader = async ({ context }: LoaderFunctionArgs) => {
  const client = context.get(apolloClientContext);
  const { data } = await client.query({ query: CmsAdminBaseQueryDocument, errorPolicy: 'none' });
  return data;
};

export function useCmsAdminBaseQueryLoader() {
  return useRequiredRouteLoaderData<typeof cmsAdminBaseQueryLoader>(NamedRoute.CmsAdmin);
}

import { LoaderFunctionArgs } from 'react-router';
import { apolloClientContext } from 'AppContexts';
import { CmsPagesAdminQueryDocument } from './queries.generated';
import { NamedRoute } from '../../NamedRoute';
import useRequiredRouteLoaderData from '../../useRequiredRouteLoaderData';

export const cmsPagesAdminLoader = async ({ context }: LoaderFunctionArgs) => {
  const client = context.get(apolloClientContext);
  const { data } = await client.query({ query: CmsPagesAdminQueryDocument, errorPolicy: 'none' });
  return data;
};

export function useCmsPagesAdminLoader() {
  return useRequiredRouteLoaderData<typeof cmsPagesAdminLoader>(NamedRoute.CmsPagesAdmin);
}

export const singleCmsPageAdminLoader = async ({ params: { id }, ...args }: LoaderFunctionArgs) => {
  const data = await cmsPagesAdminLoader({ params: {}, ...args });
  const page = data.cmsParent.cmsPages.find((page) => page.id === id);

  if (!page) {
    throw new Response(null, { status: 404 });
  }

  return { page, data };
};

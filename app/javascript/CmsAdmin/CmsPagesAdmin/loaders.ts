import { useRouteLoaderData } from 'react-router';
import { apolloClientContext } from '~/AppContexts';
import { CmsPagesAdminQueryData, CmsPagesAdminQueryDocument } from './queries.generated';
import { NamedRoute } from '../../AppRouter';
import { Route as RootRoute } from './+types/route';
import { Route as SingleRoute } from './+types/SinglePageRoute';

export const cmsPagesAdminLoader = async ({ context }: RootRoute.ClientLoaderArgs) => {
  const client = context.get(apolloClientContext);
  const { data } = await client.query({ query: CmsPagesAdminQueryDocument });
  return data;
};

export function useCmsPagesAdminLoader() {
  return useRouteLoaderData(NamedRoute.CmsPagesAdmin) as CmsPagesAdminQueryData;
}

export type SingleCmsPageAdminLoaderResult = {
  data: CmsPagesAdminQueryData;
  page: CmsPagesAdminQueryData['cmsParent']['cmsPages'][number];
};

export const singleCmsPageAdminLoader = async ({ params: { id }, ...args }: SingleRoute.ClientLoaderArgs) => {
  const data = await cmsPagesAdminLoader({ params: {}, ...args });
  const page = data?.cmsParent.cmsPages.find((page) => page.id === id);

  if (!page) {
    throw new Response(null, { status: 404 });
  }

  return { page, data };
};

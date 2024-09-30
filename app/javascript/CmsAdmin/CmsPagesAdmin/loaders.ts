import { LoaderFunction, useRouteLoaderData } from 'react-router';
import { client } from '../../useIntercodeApolloClient';
import { CmsPagesAdminQueryData, CmsPagesAdminQueryDocument } from './queries.generated';
import { NamedRoute } from '../../appRoutes';

export const cmsPagesAdminLoader: LoaderFunction = async () => {
  const { data } = await client.query<CmsPagesAdminQueryData>({ query: CmsPagesAdminQueryDocument });
  return data;
};

export function useCmsPagesAdminLoader() {
  return useRouteLoaderData(NamedRoute.CmsPagesAdmin) as CmsPagesAdminQueryData;
}

export type SingleCmsPageAdminLoaderResult = {
  data: CmsPagesAdminQueryData;
  page: CmsPagesAdminQueryData['cmsParent']['cmsPages'][number];
};

export const singleCmsPageAdminLoader: LoaderFunction = async ({ params: { id }, ...args }) => {
  const data = (await cmsPagesAdminLoader({ params: {}, ...args })) as CmsPagesAdminQueryData;
  const page = data.cmsParent.cmsPages.find((page) => page.id === id);

  if (!page) {
    throw new Response(null, { status: 404 });
  }

  return { page, data };
};

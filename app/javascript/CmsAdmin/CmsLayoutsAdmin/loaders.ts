import { LoaderFunction, useRouteLoaderData } from 'react-router';
import { client } from '../../useIntercodeApolloClient';
import { CmsLayoutsAdminQueryData, CmsLayoutsAdminQueryDocument } from './queries.generated';
import { NamedRoute } from '../../appRoutes';

export const cmsLayoutsAdminLoader: LoaderFunction = async () => {
  const { data } = await client.query<CmsLayoutsAdminQueryData>({ query: CmsLayoutsAdminQueryDocument });
  return data;
};

export function useCmsLayoutsAdminLoader() {
  return useRouteLoaderData(NamedRoute.CmsLayoutsAdmin) as CmsLayoutsAdminQueryData;
}

export type SingleCmsLayoutAdminLoaderResult = {
  data: CmsLayoutsAdminQueryData;
  layout: CmsLayoutsAdminQueryData['cmsParent']['cmsLayouts'][number];
};

export const singleCmsLayoutAdminLoader: LoaderFunction = async ({ params: { id }, ...args }) => {
  const data = (await cmsLayoutsAdminLoader({ params: {}, ...args })) as CmsLayoutsAdminQueryData;
  const layout = data.cmsParent.cmsLayouts.find((layout) => layout.id === id);

  if (!layout) {
    throw new Response(null, { status: 404 });
  }

  return { layout, data };
};

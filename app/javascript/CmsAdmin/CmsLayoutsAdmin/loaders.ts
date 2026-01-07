import { useRouteLoaderData } from 'react-router';
import { apolloClientContext } from '~/AppContexts';
import { CmsLayoutsAdminQueryData, CmsLayoutsAdminQueryDocument } from './queries.generated';
import { NamedRoute } from '~/routes';
import { Route as RootRoute } from './+types/route';
import { Route as SingleRoute } from './+types/SingleLayoutRoute';

export const cmsLayoutsAdminLoader = async ({ context }: RootRoute.ClientLoaderArgs) => {
  const client = context.get(apolloClientContext);
  const { data } = await client.query({ query: CmsLayoutsAdminQueryDocument });
  return data;
};

export function useCmsLayoutsAdminLoader() {
  return useRouteLoaderData(NamedRoute.CmsLayoutsAdmin) as CmsLayoutsAdminQueryData;
}

export type SingleCmsLayoutAdminLoaderResult = {
  data: CmsLayoutsAdminQueryData;
  layout: CmsLayoutsAdminQueryData['cmsParent']['cmsLayouts'][number];
};

export const singleCmsLayoutAdminLoader = async ({ params: { id }, ...args }: SingleRoute.ClientLoaderArgs) => {
  const data = await cmsLayoutsAdminLoader({ params: {}, ...args });
  const layout = data?.cmsParent.cmsLayouts.find((layout) => layout.id === id);

  if (!layout) {
    throw new Response(null, { status: 404 });
  }

  return { layout, data };
};

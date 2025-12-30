import { useRouteLoaderData } from 'react-router';
import { apolloClientContext } from '~/AppContexts';
import { CmsContentGroupsAdminQueryData, CmsContentGroupsAdminQueryDocument } from './queries.generated';
import { NamedRoute } from '../../AppRouter';
import { Route as RootRoute } from './+types/route';
import { Route as SingleRoute } from './+types/SingleCmsContentGroupRoute';

export const cmsContentGroupsAdminLoader = async ({ context }: RootRoute.ClientLoaderArgs) => {
  const client = context.get(apolloClientContext);
  const { data } = await client.query({ query: CmsContentGroupsAdminQueryDocument });
  return data;
};

export function useCmsContentGroupsAdminLoader() {
  return useRouteLoaderData(NamedRoute.CmsContentGroupsAdmin) as CmsContentGroupsAdminQueryData;
}

export type SingleCmsContentGroupAdminLoaderResult = {
  data: CmsContentGroupsAdminQueryData;
  contentGroup: CmsContentGroupsAdminQueryData['cmsParent']['cmsContentGroups'][number];
};

export const singleCmsContentGroupAdminLoader = async ({ params: { id }, ...args }: SingleRoute.ClientLoaderArgs) => {
  const data = await cmsContentGroupsAdminLoader({ params: {}, ...args });
  const contentGroup = data?.cmsParent.cmsContentGroups.find((contentGroup) => contentGroup.id === id);

  if (!contentGroup) {
    throw new Response(null, { status: 404 });
  }

  return { contentGroup, data };
};

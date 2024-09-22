import { LoaderFunction, useRouteLoaderData } from 'react-router';
import { client } from '../../useIntercodeApolloClient';
import { CmsContentGroupsAdminQueryData, CmsContentGroupsAdminQueryDocument } from './queries.generated';
import { NamedRoute } from '../../AppRouter';

export const cmsContentGroupsAdminLoader: LoaderFunction = async () => {
  const { data } = await client.query<CmsContentGroupsAdminQueryData>({ query: CmsContentGroupsAdminQueryDocument });
  return data;
};

export function useCmsContentGroupsAdminLoader() {
  return useRouteLoaderData(NamedRoute.CmsContentGroupsAdmin) as CmsContentGroupsAdminQueryData;
}

export type SingleCmsContentGroupAdminLoaderResult = {
  data: CmsContentGroupsAdminQueryData;
  contentGroup: CmsContentGroupsAdminQueryData['cmsParent']['cmsContentGroups'][number];
};

export const singleCmsContentGroupAdminLoader: LoaderFunction = async ({ params: { id }, ...args }) => {
  const data = (await cmsContentGroupsAdminLoader({ params: {}, ...args })) as CmsContentGroupsAdminQueryData;
  const contentGroup = data.cmsParent.cmsContentGroups.find((contentGroup) => contentGroup.id === id);

  if (!contentGroup) {
    throw new Response(null, { status: 404 });
  }

  return { contentGroup, data };
};

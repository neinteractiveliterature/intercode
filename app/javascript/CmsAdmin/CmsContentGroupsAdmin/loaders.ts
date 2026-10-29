import { LoaderFunctionArgs } from 'react-router';
import { apolloClientContext } from 'AppContexts';
import { CmsContentGroupsAdminQueryDocument } from './queries.generated';
import { NamedRoute } from '../../NamedRoute';
import useRequiredRouteLoaderData from '../../useRequiredRouteLoaderData';

export const cmsContentGroupsAdminLoader = async ({ context }: LoaderFunctionArgs) => {
  const client = context.get(apolloClientContext);
  const { data } = await client.query({ query: CmsContentGroupsAdminQueryDocument, errorPolicy: 'none' });
  return data;
};

export function useCmsContentGroupsAdminLoader() {
  return useRequiredRouteLoaderData<typeof cmsContentGroupsAdminLoader>(NamedRoute.CmsContentGroupsAdmin);
}

export const singleCmsContentGroupAdminLoader = async ({ params: { id }, ...args }: LoaderFunctionArgs) => {
  const data = await cmsContentGroupsAdminLoader({ params: {}, ...args });
  const contentGroup = data.cmsParent.cmsContentGroups.find((contentGroup) => contentGroup.id === id);

  if (!contentGroup) {
    throw new Response(null, { status: 404 });
  }

  return { contentGroup, data };
};

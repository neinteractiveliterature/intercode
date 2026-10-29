import { LoaderFunctionArgs } from 'react-router';
import { apolloClientContext } from 'AppContexts';
import { CmsLayoutsAdminQueryDocument } from './queries.generated';
import { NamedRoute } from '../../NamedRoute';
import useRequiredRouteLoaderData from '../../useRequiredRouteLoaderData';

export const cmsLayoutsAdminLoader = async ({ context }: LoaderFunctionArgs) => {
  const client = context.get(apolloClientContext);
  const { data } = await client.query({ query: CmsLayoutsAdminQueryDocument, errorPolicy: 'none' });
  return data;
};

export function useCmsLayoutsAdminLoader() {
  return useRequiredRouteLoaderData<typeof cmsLayoutsAdminLoader>(NamedRoute.CmsLayoutsAdmin);
}

export const singleCmsLayoutAdminLoader = async ({ params: { id }, ...args }: LoaderFunctionArgs) => {
  const data = await cmsLayoutsAdminLoader({ params: {}, ...args });
  const layout = data.cmsParent.cmsLayouts.find((layout) => layout.id === id);

  if (!layout) {
    throw new Response(null, { status: 404 });
  }

  return { layout, data };
};

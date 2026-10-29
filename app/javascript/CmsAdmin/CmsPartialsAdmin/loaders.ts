import { LoaderFunctionArgs } from 'react-router';
import { apolloClientContext } from 'AppContexts';
import { CmsPartialsAdminQueryDocument } from './queries.generated';
import { NamedRoute } from '../../NamedRoute';
import useRequiredRouteLoaderData from '../../useRequiredRouteLoaderData';

export const cmsPartialsAdminLoader = async ({ context }: LoaderFunctionArgs) => {
  const client = context.get(apolloClientContext);
  const { data } = await client.query({ query: CmsPartialsAdminQueryDocument, errorPolicy: 'none' });
  return data;
};

export function useCmsPartialsAdminLoader() {
  return useRequiredRouteLoaderData<typeof cmsPartialsAdminLoader>(NamedRoute.CmsPartialsAdmin);
}

export const singleCmsPartialAdminLoader = async ({ params: { id }, ...args }: LoaderFunctionArgs) => {
  const data = await cmsPartialsAdminLoader({ params: {}, ...args });
  const partial = data.cmsParent.cmsPartials.find((partial) => partial.id === id);

  if (!partial) {
    throw new Response(null, { status: 404 });
  }

  return { partial, data };
};

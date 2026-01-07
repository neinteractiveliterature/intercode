import { useRouteLoaderData } from 'react-router';
import { apolloClientContext } from '~/AppContexts';
import { CmsPartialsAdminQueryData, CmsPartialsAdminQueryDocument } from './queries.generated';
import { NamedRoute } from '~/routes';
import { Route as RootRoute } from './+types/route';
import { Route as SingleRoute } from './+types/SinglePartialRoute';

export const cmsPartialsAdminLoader = async ({ context }: RootRoute.ClientLoaderArgs) => {
  const client = context.get(apolloClientContext);
  const { data } = await client.query({ query: CmsPartialsAdminQueryDocument });
  return data;
};

export function useCmsPartialsAdminLoader() {
  return useRouteLoaderData(NamedRoute.CmsPartialsAdmin) as CmsPartialsAdminQueryData;
}

export type SingleCmsPartialAdminLoaderResult = {
  data: CmsPartialsAdminQueryData;
  partial: CmsPartialsAdminQueryData['cmsParent']['cmsPartials'][number];
};

export const singleCmsPartialAdminLoader = async ({ params: { id }, ...args }: SingleRoute.ClientLoaderArgs) => {
  const data = await cmsPartialsAdminLoader({ params: {}, ...args });
  const partial = data?.cmsParent.cmsPartials.find((partial) => partial.id === id);

  if (!partial) {
    throw new Response(null, { status: 404 });
  }

  return { partial, data };
};

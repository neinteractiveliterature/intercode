import { LoaderFunction, useRouteLoaderData } from 'react-router';
import { client } from '../../useIntercodeApolloClient';
import { CmsPartialsAdminQueryData, CmsPartialsAdminQueryDocument } from './queries.generated';
import { NamedRoute } from '../../routes';

export const cmsPartialsAdminLoader: LoaderFunction = async () => {
  const { data } = await client.query<CmsPartialsAdminQueryData>({ query: CmsPartialsAdminQueryDocument });
  return data;
};

export function useCmsPartialsAdminLoader() {
  return useRouteLoaderData(NamedRoute.CmsPartialsAdmin) as CmsPartialsAdminQueryData;
}

export type SingleCmsPartialAdminLoaderResult = {
  data: CmsPartialsAdminQueryData;
  partial: CmsPartialsAdminQueryData['cmsParent']['cmsPartials'][number];
};

export const singleCmsPartialAdminLoader: LoaderFunction = async ({ params: { id }, ...args }) => {
  const data = (await cmsPartialsAdminLoader({ params: {}, ...args })) as CmsPartialsAdminQueryData;
  const partial = data.cmsParent.cmsPartials.find((partial) => partial.id === id);

  if (!partial) {
    throw new Response(null, { status: 404 });
  }

  return { partial, data };
};

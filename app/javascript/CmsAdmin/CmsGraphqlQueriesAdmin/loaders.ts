import { LoaderFunction, RouterContextProvider, useRouteLoaderData } from 'react-router';
import { apolloClientContext } from 'AppContexts';
import { CmsGraphqlQueriesQueryData, CmsGraphqlQueriesQueryDocument } from './queries.generated';
import { NamedRoute } from '../../AppRouter';

export const cmsGraphqlQueriesAdminLoader: LoaderFunction<RouterContextProvider> = async ({ context }) => {
  const client = context.get(apolloClientContext);
  const { data } = await client.query<CmsGraphqlQueriesQueryData>({ query: CmsGraphqlQueriesQueryDocument });
  return data;
};

export function useCmsGraphqlQueriesAdminLoader() {
  return useRouteLoaderData(NamedRoute.CmsGraphqlQueriesAdmin) as CmsGraphqlQueriesQueryData;
}

export type SingleCmsGraphqlQueryAdminLoaderResult = {
  data: CmsGraphqlQueriesQueryData;
  graphqlQuery: CmsGraphqlQueriesQueryData['cmsParent']['cmsGraphqlQueries'][number];
};

export const singleCmsGraphqlQueryAdminLoader: LoaderFunction = async ({ params: { id }, ...args }) => {
  const data = (await cmsGraphqlQueriesAdminLoader({ params: {}, ...args })) as CmsGraphqlQueriesQueryData;
  const graphqlQuery = data.cmsParent.cmsGraphqlQueries.find((graphqlQuery) => graphqlQuery.id === id);

  if (!graphqlQuery) {
    throw new Response(null, { status: 404 });
  }

  return { graphqlQuery, data };
};

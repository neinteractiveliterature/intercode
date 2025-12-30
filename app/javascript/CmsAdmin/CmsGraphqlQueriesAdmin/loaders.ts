import { useRouteLoaderData } from 'react-router';
import { apolloClientContext } from '~/AppContexts';
import { CmsGraphqlQueriesQueryData, CmsGraphqlQueriesQueryDocument } from './queries.generated';
import { NamedRoute } from '../../AppRouter';
import { Route as RootRoute } from './+types/route';
import { Route as SingleRoute } from './+types/SingleGraphqlQueryRoute';

export const cmsGraphqlQueriesAdminLoader = async ({ context }: RootRoute.ClientLoaderArgs) => {
  const client = context.get(apolloClientContext);
  const { data } = await client.query({ query: CmsGraphqlQueriesQueryDocument });
  return data;
};

export function useCmsGraphqlQueriesAdminLoader() {
  return useRouteLoaderData(NamedRoute.CmsGraphqlQueriesAdmin) as CmsGraphqlQueriesQueryData;
}

export type SingleCmsGraphqlQueryAdminLoaderResult = {
  data: CmsGraphqlQueriesQueryData;
  graphqlQuery: CmsGraphqlQueriesQueryData['cmsParent']['cmsGraphqlQueries'][number];
};

export const singleCmsGraphqlQueryAdminLoader = async ({ params: { id }, ...args }: SingleRoute.ClientLoaderArgs) => {
  const data = await cmsGraphqlQueriesAdminLoader({ params: {}, ...args });
  const graphqlQuery = data?.cmsParent.cmsGraphqlQueries.find((graphqlQuery) => graphqlQuery.id === id);

  if (!graphqlQuery) {
    throw new Response(null, { status: 404 });
  }

  return { graphqlQuery, data };
};

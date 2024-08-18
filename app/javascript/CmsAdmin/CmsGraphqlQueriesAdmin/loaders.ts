import { LoaderFunction, useRouteLoaderData } from 'react-router';
import { client } from '../../useIntercodeApolloClient';
import { CmsGraphqlQueriesQueryData, CmsGraphqlQueriesQueryDocument } from './queries.generated';
import { NamedRoute } from '../../AppRouter';

export const cmsGraphqlQueriesAdminLoader: LoaderFunction = async () => {
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

import { LoaderFunctionArgs } from 'react-router';
import { apolloClientContext } from 'AppContexts';
import { CmsGraphqlQueriesQueryDocument } from './queries.generated';
import { NamedRoute } from '../../NamedRoute';
import useRequiredRouteLoaderData from '../../useRequiredRouteLoaderData';

export const cmsGraphqlQueriesAdminLoader = async ({ context }: LoaderFunctionArgs) => {
  const client = context.get(apolloClientContext);
  const { data } = await client.query({ query: CmsGraphqlQueriesQueryDocument, errorPolicy: 'none' });
  return data;
};

export function useCmsGraphqlQueriesAdminLoader() {
  return useRequiredRouteLoaderData<typeof cmsGraphqlQueriesAdminLoader>(NamedRoute.CmsGraphqlQueriesAdmin);
}

export const singleCmsGraphqlQueryAdminLoader = async ({ params: { id }, ...args }: LoaderFunctionArgs) => {
  const data = await cmsGraphqlQueriesAdminLoader({ params: {}, ...args });
  const graphqlQuery = data.cmsParent.cmsGraphqlQueries.find((graphqlQuery) => graphqlQuery.id === id);

  if (!graphqlQuery) {
    throw new Response(null, { status: 404 });
  }

  return { graphqlQuery, data };
};

import { redirect } from 'react-router';
import { Route } from './+types/SingleGraphqlQueryRoute';
import { apolloClientContext } from '../../AppContexts';
import { DeleteCmsGraphqlQueryDocument } from './mutations.generated';

export const clientAction = async ({ request, params: { id }, context }: Route.ClientActionArgs) => {
  const client = context.get(apolloClientContext);
  if (request.method === 'DELETE') {
    await client.mutate({
      mutation: DeleteCmsGraphqlQueryDocument,
      variables: {
        id: id ?? '',
      },
    });
    await client.resetStore();

    return redirect('/cms_graphql_queries');
  }

  return new Response(null, { status: 404 });
};

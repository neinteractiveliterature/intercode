import { ActionFunction, redirect, RouterContextProvider } from 'react-router';
import { apolloClientContext } from '../../AppContexts';
import { DeleteCmsGraphqlQueryDocument } from './mutations.generated';

export const clientAction: ActionFunction<RouterContextProvider> = async ({ request, params: { id }, context }) => {
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

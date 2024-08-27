import { ActionFunction, redirect } from 'react-router';
import { client } from '../../useIntercodeApolloClient';
import { DeleteCmsGraphqlQueryDocument } from './mutations.generated';

export const action: ActionFunction = async ({ request, params: { id } }) => {
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

import { ActionFunction, redirect } from 'react-router';
import { client } from '../../useIntercodeApolloClient';
import { DeletePageDocument } from './mutations.generated';

export const action: ActionFunction = async ({ request, params: { id } }) => {
  if (request.method === 'DELETE') {
    await client.mutate({
      mutation: DeletePageDocument,
      variables: {
        id: id ?? '',
      },
    });
    await client.resetStore();

    return redirect('/cms_pages');
  }

  return new Response(null, { status: 404 });
};

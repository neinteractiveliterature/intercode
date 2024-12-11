import { ActionFunction, redirect } from 'react-router';
import { client } from '../../useIntercodeApolloClient';
import { DeleteLayoutDocument } from './mutations.generated';

export async function action({ request, params: { id } }) {
  if (request.method === 'DELETE') {
    await client.mutate({
      mutation: DeleteLayoutDocument,
      variables: {
        id: id ?? '',
      },
    });
    await client.resetStore();

    return redirect('/cms_layouts');
  }

  return new Response(null, { status: 404 });
}

import { ActionFunction, redirect } from 'react-router';
import { client } from '../../useIntercodeApolloClient';
import { DeletePartialDocument } from './mutations.generated';

export async function action({ request, params: { id } }) {
  if (request.method === 'DELETE') {
    await client.mutate({
      mutation: DeletePartialDocument,
      variables: {
        id: id ?? '',
      },
    });
    await client.resetStore();

    return redirect('/cms_partials');
  }

  return new Response(null, { status: 404 });
}

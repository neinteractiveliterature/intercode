import { ActionFunction, redirect } from 'react-router';
import { client } from '../../useIntercodeApolloClient';
import { DeleteContentGroupDocument } from './mutations.generated';

export const action: ActionFunction = async ({ request, params: { id } }) => {
  if (request.method === 'DELETE') {
    await client.mutate({
      mutation: DeleteContentGroupDocument,
      variables: {
        id: id ?? '',
      },
    });
    await client.resetStore();

    return redirect('/cms_content_groups');
  }

  return new Response(null, { status: 404 });
};

import { ActionFunction, redirect, RouterContextProvider } from 'react-router';
import { apolloClientContext } from '../../AppContexts';
import { DeletePageDocument } from './mutations.generated';

export const clientAction: ActionFunction<RouterContextProvider> = async ({ request, params: { id }, context }) => {
  const client = context.get(apolloClientContext);
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

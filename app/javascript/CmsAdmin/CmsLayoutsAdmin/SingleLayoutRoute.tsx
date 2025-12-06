import { ActionFunction, redirect, RouterContextProvider } from 'react-router';
import { apolloClientContext } from '../../AppContexts';
import { DeleteLayoutDocument } from './mutations.generated';

export const action: ActionFunction<RouterContextProvider> = async ({ request, params: { id }, context }) => {
  const client = context.get(apolloClientContext);
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
};

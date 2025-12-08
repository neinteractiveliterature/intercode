import { ActionFunction, redirect, RouterContextProvider } from 'react-router';
import { apolloClientContext } from '../../AppContexts';
import { DeletePartialDocument } from './mutations.generated';

export const action: ActionFunction<RouterContextProvider> = async ({ request, params: { id }, context }) => {
  const client = context.get(apolloClientContext);
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
};

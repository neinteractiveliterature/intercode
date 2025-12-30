import { redirect } from 'react-router';
import { Route } from './+types/SingleLayoutRoute';
import { apolloClientContext } from '../../AppContexts';
import { DeleteLayoutDocument } from './mutations.generated';

export const clientAction = async ({ request, params: { id }, context }: Route.ClientActionArgs) => {
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

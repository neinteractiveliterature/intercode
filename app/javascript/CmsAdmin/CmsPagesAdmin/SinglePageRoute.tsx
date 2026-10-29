import { redirect } from 'react-router';
import { apolloClientContext } from '../../AppContexts';
import { DeletePageDocument } from './mutations.generated';
import type { Route } from './+types/SinglePageRoute';

export const clientAction = async ({ request, params: { id }, context }: Route.ClientActionArgs) => {
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

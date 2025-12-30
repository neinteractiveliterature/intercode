import { redirect } from 'react-router';
import { Route } from './+types/SinglePageRoute';
import { apolloClientContext } from '../../AppContexts';
import { DeletePageDocument } from './mutations.generated';

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

import { redirect } from 'react-router';
import { Route } from './+types/SinglePartialRoute';
import { apolloClientContext } from '../../AppContexts';
import { DeletePartialDocument } from './mutations.generated';

export const clientAction = async ({ request, params: { id }, context }: Route.ClientActionArgs) => {
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

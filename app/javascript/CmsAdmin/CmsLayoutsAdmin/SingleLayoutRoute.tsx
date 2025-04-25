import { redirect } from 'react-router';
import { DeleteLayoutDocument } from './mutations.generated';
import { Route } from './+types/SingleLayoutRoute';
import { apolloClientContext } from 'AppContexts';

export async function action({ request, params: { id }, context }: Route.ActionArgs) {
  if (request.method === 'DELETE') {
    await context.get(apolloClientContext).mutate({
      mutation: DeleteLayoutDocument,
      variables: {
        id: id ?? '',
      },
    });
    await context.get(apolloClientContext).resetStore();

    return redirect('/cms_layouts');
  }

  return new Response(null, { status: 404 });
}

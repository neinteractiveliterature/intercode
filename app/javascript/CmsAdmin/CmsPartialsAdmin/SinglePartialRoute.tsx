import { redirect } from 'react-router';
import { DeletePartialDocument } from './mutations.generated';
import { Route } from './+types/SinglePartialRoute';
import { apolloClientContext } from 'AppContexts';

export async function action({ request, params: { id }, context }: Route.ActionArgs) {
  if (request.method === 'DELETE') {
    await context.get(apolloClientContext).mutate({
      mutation: DeletePartialDocument,
      variables: {
        id: id ?? '',
      },
    });
    await context.get(apolloClientContext).resetStore();

    return redirect('/cms_partials');
  }

  return new Response(null, { status: 404 });
}

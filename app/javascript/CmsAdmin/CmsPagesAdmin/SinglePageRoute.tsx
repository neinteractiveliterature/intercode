import { redirect } from 'react-router';
import { DeletePageDocument } from './mutations.generated';
import { Route } from './+types/SinglePageRoute';
import { apolloClientContext } from 'AppContexts';

export async function action({ request, params: { id }, context }: Route.ActionArgs) {
  if (request.method === 'DELETE') {
    await context.get(apolloClientContext).mutate({
      mutation: DeletePageDocument,
      variables: {
        id: id ?? '',
      },
    });
    await context.get(apolloClientContext).resetStore();

    return redirect('/cms_pages');
  }

  return new Response(null, { status: 404 });
}

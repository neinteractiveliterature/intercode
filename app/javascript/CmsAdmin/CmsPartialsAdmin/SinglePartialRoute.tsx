import { redirect } from 'react-router';
import { DeletePartialDocument } from './mutations.generated';
import { Route } from './+types/SinglePartialRoute';

export async function action({ request, params: { id }, context }: Route.ActionArgs) {
  if (request.method === 'DELETE') {
    await context.client.mutate({
      mutation: DeletePartialDocument,
      variables: {
        id: id ?? '',
      },
    });
    await context.client.resetStore();

    return redirect('/cms_partials');
  }

  return new Response(null, { status: 404 });
}

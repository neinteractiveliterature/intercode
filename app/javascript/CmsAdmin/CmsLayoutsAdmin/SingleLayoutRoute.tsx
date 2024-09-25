import { redirect } from 'react-router';
import { DeleteLayoutDocument } from './mutations.generated';
import { Route } from './+types/SingleLayoutRoute';

export async function action({ request, params: { id }, context }: Route.ActionArgs) {
  if (request.method === 'DELETE') {
    await context.client.mutate({
      mutation: DeleteLayoutDocument,
      variables: {
        id: id ?? '',
      },
    });
    await context.client.resetStore();

    return redirect('/cms_layouts');
  }

  return new Response(null, { status: 404 });
}

import { redirect } from 'react-router';
import { DeletePageDocument } from './mutations.generated';
import { Route } from './+types/SinglePageRoute';

export async function action({ request, params: { id }, context }: Route.ActionArgs) {
  if (request.method === 'DELETE') {
    await context.client.mutate({
      mutation: DeletePageDocument,
      variables: {
        id: id ?? '',
      },
    });
    await context.client.resetStore();

    return redirect('/cms_pages');
  }

  return new Response(null, { status: 404 });
}

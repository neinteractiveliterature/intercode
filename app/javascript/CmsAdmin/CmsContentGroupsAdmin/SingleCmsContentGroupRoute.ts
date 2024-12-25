import { redirect } from 'react-router';
import { DeleteContentGroupDocument } from './mutations.generated';
import { Route } from './+types/SingleCmsContentGroupRoute';

export async function action({ request, params: { id }, context }: Route.ActionArgs) {
  if (request.method === 'DELETE') {
    await context.client.mutate({
      mutation: DeleteContentGroupDocument,
      variables: { id },
    });
    await context.client.resetStore();

    return redirect('/cms_content_groups');
  }

  return new Response(null, { status: 404 });
}

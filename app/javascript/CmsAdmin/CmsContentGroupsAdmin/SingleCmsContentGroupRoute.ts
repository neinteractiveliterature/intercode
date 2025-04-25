import { redirect } from 'react-router';
import { DeleteContentGroupDocument } from './mutations.generated';
import { Route } from './+types/SingleCmsContentGroupRoute';
import { apolloClientContext } from 'AppContexts';

export async function action({ request, params: { id }, context }: Route.ActionArgs) {
  if (request.method === 'DELETE') {
    await context.get(apolloClientContext).mutate({
      mutation: DeleteContentGroupDocument,
      variables: { id },
    });
    await context.get(apolloClientContext).resetStore();

    return redirect('/cms_content_groups');
  }

  return new Response(null, { status: 404 });
}

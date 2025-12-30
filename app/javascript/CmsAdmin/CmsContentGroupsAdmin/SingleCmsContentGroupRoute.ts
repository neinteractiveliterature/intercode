import { redirect } from 'react-router';
import { Route } from './+types/SingleCmsContentGroupRoute';
import { apolloClientContext } from '../../AppContexts';
import { DeleteContentGroupDocument } from './mutations.generated';

export const clientAction = async ({ request, params: { id }, context }: Route.ClientActionArgs) => {
  const client = context.get(apolloClientContext);
  if (request.method === 'DELETE') {
    await client.mutate({
      mutation: DeleteContentGroupDocument,
      variables: {
        id: id ?? '',
      },
    });
    await client.resetStore();

    return redirect('/cms_content_groups');
  }

  return new Response(null, { status: 404 });
};

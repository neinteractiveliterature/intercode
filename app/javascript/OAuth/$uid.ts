import { redirect } from 'react-router';
import { RevokeAuthorizedApplicationDocument } from './mutations.generated';
import { AuthorizedApplication } from 'graphqlTypes.generated';
import { Route } from './+types/$uid';

export async function action({ params: { uid }, request, context }: Route.ActionArgs) {
  try {
    if (request.method === 'DELETE') {
      await context.client.mutate({
        mutation: RevokeAuthorizedApplicationDocument,
        variables: { uid },
        update: (cache) => {
          cache.modify<AuthorizedApplication>({
            id: cache.identify({ __typename: 'AuthorizedApplication', uid }),
            fields: (field, { DELETE }) => DELETE,
          });
        },
      });
      return redirect('/oauth/authorized_applications');
    } else {
      return new Response(null, { status: 404 });
    }
  } catch (error) {
    return error;
  }
}

import { redirect } from 'react-router';
import { apolloClientContext } from '../AppContexts';
import { RevokeAuthorizedApplicationDocument } from './mutations.generated';
import { AuthorizedApplication } from '~/graphqlTypes.generated';
import { Route } from './+types/$uid';

export const clientAction = async ({ context, params: { uid }, request }: Route.ClientActionArgs) => {
  const client = context.get(apolloClientContext);
  try {
    if (request.method === 'DELETE') {
      await client.mutate({
        mutation: RevokeAuthorizedApplicationDocument,
        variables: { uid: uid ?? '' },
        update: (cache) => {
          cache.modify<AuthorizedApplication>({
            id: cache.identify({ __typename: 'AuthorizedApplication', uid }),
            fields: (_field, { DELETE }) => DELETE,
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
};

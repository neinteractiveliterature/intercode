import { ActionFunction, RouterContextProvider, redirect } from 'react-router';
import { apolloClientContext } from '../AppContexts';
import { RevokeAuthorizedApplicationDocument } from './mutations.generated';
import { AuthorizedApplication } from '~/graphqlTypes.generated';

export const clientAction: ActionFunction<RouterContextProvider> = async ({ context, params: { uid }, request }) => {
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

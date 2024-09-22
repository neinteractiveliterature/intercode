import { ActionFunction, redirect } from 'react-router';
import { client } from 'useIntercodeApolloClient';
import { RevokeAuthorizedApplicationDocument } from './mutations.generated';
import { AuthorizedApplication } from 'graphqlTypes.generated';

export const action: ActionFunction = async ({ params: { uid }, request }) => {
  try {
    if (request.method === 'DELETE') {
      await client.mutate({
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
};

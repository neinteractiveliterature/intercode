import { ActionFunction, RouterContextProvider, data } from 'react-router';

import { DeleteOAuthApplicationDocument } from '../mutations.generated';
import { apolloClientContext } from '../../AppContexts';
import { OAuthApplication } from '../../graphqlTypes.generated';

export const action: ActionFunction<RouterContextProvider> = async ({ context, request, params: { id } }) => {
  const client = context.get(apolloClientContext);
  try {
    if (request.method === 'DELETE') {
      const result = await client.mutate({
        mutation: DeleteOAuthApplicationDocument,
        variables: { input: { id } },
        update: (cache) => {
          cache.modify<OAuthApplication>({
            id: cache.identify({ __typename: 'OAuthApplication', id }),
            fields: (value, { DELETE }) => DELETE,
          });
        },
      });
      return data(result.data);
    }
  } catch (error) {
    return error;
  }
};

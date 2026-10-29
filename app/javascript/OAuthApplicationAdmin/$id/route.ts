import { data } from 'react-router';

import { DeleteOAuthApplicationDocument } from '../mutations.generated';
import { apolloClientContext } from '../../AppContexts';
import { OAuthApplication } from '../../graphqlTypes.generated';
import type { Route } from './+types/route';

export const clientAction = async ({ context, request, params }: Route.ClientActionArgs) => {
  const id = params.id!;
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

import { replace } from 'react-router';
import { apolloClientContext } from '../../AppContexts';
import { DeleteEventProposalDocument } from '../mutations.generated';
import { Route } from './+types/route';

export const clientAction = async ({ context, request, params: { id } }: Route.ClientActionArgs) => {
  const client = context.get(apolloClientContext);
  try {
    if (request.method === 'DELETE') {
      await client.mutate({
        mutation: DeleteEventProposalDocument,
        variables: { id: id ?? '' },
      });
      await client.resetStore();
      return replace('/pages/new-proposal');
    } else {
      return new Response(null, { status: 404 });
    }
  } catch (error) {
    return error;
  }
};

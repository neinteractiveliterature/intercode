import { ActionFunction, RouterContextProvider, replace } from 'react-router';
import { apolloClientContext } from '../../AppContexts';
import { DeleteEventProposalDocument } from '../mutations.generated';

export const action: ActionFunction<RouterContextProvider> = async ({ context, request, params: { id } }) => {
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

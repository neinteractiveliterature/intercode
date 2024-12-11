import { ActionFunction, replace } from 'react-router';
import { client } from '../../useIntercodeApolloClient';
import { DeleteEventProposalDocument } from '../mutations.generated';

export async function action({ request, params: { id } }) {
  try {
    if (request.method === 'DELETE') {
      await client.mutate({
        mutation: DeleteEventProposalDocument,
        variables: { id },
      });
      await client.resetStore();
      return replace('/pages/new-proposal');
    } else {
      return new Response(null, { status: 404 });
    }
  } catch (error) {
    return error;
  }
}

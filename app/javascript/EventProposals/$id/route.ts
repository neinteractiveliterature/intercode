import { replace } from 'react-router';
import { DeleteEventProposalDocument } from '../mutations.generated';
import { Route } from './+types/route';

export async function action({ request, params: { id }, context }: Route.ActionArgs) {
  try {
    if (request.method === 'DELETE') {
      await context.client.mutate({
        mutation: DeleteEventProposalDocument,
        variables: { id },
      });
      await context.client.resetStore();
      return replace('/pages/new-proposal');
    } else {
      return new Response(null, { status: 404 });
    }
  } catch (error) {
    return error;
  }
}

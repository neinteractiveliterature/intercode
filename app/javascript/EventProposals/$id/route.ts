import { replace } from 'react-router';
import { DeleteEventProposalDocument } from '../mutations.generated';
import { Route } from './+types/route';
import { apolloClientContext } from 'AppContexts';

export async function action({ request, params: { id }, context }: Route.ActionArgs) {
  try {
    if (request.method === 'DELETE') {
      await context.get(apolloClientContext).mutate({
        mutation: DeleteEventProposalDocument,
        variables: { id },
      });
      await context.get(apolloClientContext).resetStore();
      return replace('/pages/new-proposal');
    } else {
      return new Response(null, { status: 404 });
    }
  } catch (error) {
    return error;
  }
}

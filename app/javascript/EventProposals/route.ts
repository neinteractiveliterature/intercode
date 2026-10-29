import { ActionFunction, RouterContextProvider, redirect } from 'react-router';
import { apolloClientContext } from '../AppContexts';
import { CreateEventProposalDocument } from './mutations.generated';

export const clientAction: ActionFunction<RouterContextProvider> = async ({ context, request }) => {
  const client = context.get(apolloClientContext);
  try {
    if (request.method === 'POST') {
      const formData = await request.formData();
      const result = await client.mutate({
        mutation: CreateEventProposalDocument,
        variables: {
          eventCategoryId: formData.get('event_category_id')?.toString() ?? '',
          cloneEventProposalId: formData.get('clone_event_proposal_id')?.toString(),
        },
      });
      await client.clearStore();
      return redirect(`/event_proposals/${result.data?.createEventProposal.event_proposal.id}/edit`);
    } else {
      return new Response(null, { status: 404 });
    }
  } catch (error) {
    return error;
  }
};

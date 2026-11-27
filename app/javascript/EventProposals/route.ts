import { redirect, replace } from 'react-router';
import { apolloClientContext } from '../AppContexts';
import { CreateEventProposalDocument } from './mutations.generated';
import type { Route } from './+types/route';

// There's no list page here: proposing an event starts from this CMS page
export const clientLoader = () => replace('/pages/new-proposal');

export const clientAction = async ({ context, request }: Route.ClientActionArgs) => {
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

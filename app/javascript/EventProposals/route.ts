import { redirect } from 'react-router';
import { CreateEventProposalDocument } from './mutations.generated';
import { replace } from 'react-router';
import { Route } from './+types/route';
import { apolloClientContext } from 'AppContexts';

export async function action({ request, context }: Route.ActionArgs) {
  try {
    if (request.method === 'POST') {
      const formData = await request.formData();
      const result = await context.get(apolloClientContext).mutate({
        mutation: CreateEventProposalDocument,
        variables: {
          eventCategoryId: formData.get('event_category_id')?.toString() ?? '',
          cloneEventProposalId: formData.get('clone_event_proposal_id')?.toString(),
        },
      });
      await context.get(apolloClientContext).clearStore();
      return redirect(`/event_proposals/${result.data?.createEventProposal.event_proposal.id}/edit`);
    } else {
      return new Response(null, { status: 404 });
    }
  } catch (error) {
    return error;
  }
}

export function loader() {
  return replace('/pages/new-proposal');
}

import { data } from 'react-router';
import invariant from 'tiny-invariant';
import { TransitionEventProposalDocument } from '../mutations.generated';
import { Route } from './+types/transition';

export async function action({ params: { id }, request, context }: Route.ActionArgs) {
  try {
    const formData = await request.formData();
    const status = formData.get('status')?.toString();
    invariant(status);

    const result = await context.client.mutate({
      mutation: TransitionEventProposalDocument,
      variables: {
        eventProposalId: id,
        status,
        dropEvent: formData.get('drop_event')?.toString() === 'true',
      },
    });
    await context.client.resetStore();

    return data(result.data);
  } catch (error) {
    return error;
  }
}

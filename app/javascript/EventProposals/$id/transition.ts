import { data } from 'react-router';
import invariant from 'tiny-invariant';
import { apolloClientContext } from '../../AppContexts';
import { TransitionEventProposalDocument } from '../mutations.generated';
import { Route } from './+types/transition';

export const clientAction = async ({ context, params: { id }, request }: Route.ClientActionArgs) => {
  const client = context.get(apolloClientContext);
  try {
    invariant(id);
    const formData = await request.formData();
    const status = formData.get('status')?.toString();
    invariant(status);

    const result = await client.mutate({
      mutation: TransitionEventProposalDocument,
      variables: {
        eventProposalId: id,
        status,
        dropEvent: formData.get('drop_event')?.toString() === 'true',
      },
    });
    await client.resetStore();

    return data(result.data);
  } catch (error) {
    return error;
  }
};

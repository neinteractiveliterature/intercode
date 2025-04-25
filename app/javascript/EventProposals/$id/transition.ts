import { ActionFunction, data } from 'react-router';
import invariant from 'tiny-invariant';
import { client } from '../../useIntercodeApolloClient';
import { TransitionEventProposalDocument } from '../mutations.generated';

export const action: ActionFunction = async ({ params: { id }, request }) => {
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

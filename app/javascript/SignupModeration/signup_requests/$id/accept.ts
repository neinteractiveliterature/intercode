import { apolloClientContext } from '../../../AppContexts';
import { AcceptSignupRequestDocument } from '../../mutations.generated';
import { Route } from './+types/accept';

export const clientAction = async ({ context, params: { id } }: Route.ClientActionArgs) => {
  const client = context.get(apolloClientContext);
  try {
    return await client.mutate({
      mutation: AcceptSignupRequestDocument,
      variables: { id: id ?? '' },
    });
  } catch (error) {
    return error;
  }
};

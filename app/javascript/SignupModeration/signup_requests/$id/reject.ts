import { apolloClientContext } from '../../../AppContexts';
import { RejectSignupRequestDocument } from '../../mutations.generated';
import { Route } from './+types/reject';

export const clientAction = async ({ context, params: { id } }: Route.ClientActionArgs) => {
  const client = context.get(apolloClientContext);
  try {
    return await client.mutate({
      mutation: RejectSignupRequestDocument,
      variables: { id: id ?? '' },
    });
  } catch (error) {
    return error;
  }
};

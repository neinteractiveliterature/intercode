import { apolloClientContext } from '../../../AppContexts';
import { RerunModeratedRankedChoiceSignupRoundDocument } from '../../mutations.generated';
import { Route } from './+types/rerun';

export const clientAction = async ({ context, params: { id } }: Route.ClientActionArgs) => {
  const client = context.get(apolloClientContext);
  try {
    await client.mutate({
      mutation: RerunModeratedRankedChoiceSignupRoundDocument,
      variables: { id: id ?? '' },
    });
    await client.resetStore();
    return null;
  } catch (error) {
    return error;
  }
};

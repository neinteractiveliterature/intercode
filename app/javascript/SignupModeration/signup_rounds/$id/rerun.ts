import { ActionFunction, RouterContextProvider } from 'react-router';
import { apolloClientContext } from '../../../AppContexts';
import { RerunModeratedRankedChoiceSignupRoundDocument } from '../../mutations.generated';

export const clientAction: ActionFunction<RouterContextProvider> = async ({ context, params: { id } }) => {
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

import { ActionFunction } from 'react-router';
import { client } from '../../../useIntercodeApolloClient';
import { RerunModeratedRankedChoiceSignupRoundDocument } from '../../mutations.generated';

export async function action({ params: { id } }) {
  try {
    await client.mutate({
      mutation: RerunModeratedRankedChoiceSignupRoundDocument,
      variables: { id },
    });
    await client.resetStore();
    return null;
  } catch (error) {
    return error;
  }
}

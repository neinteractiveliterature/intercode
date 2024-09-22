import { ActionFunction } from 'react-router';
import { client } from '../../../useIntercodeApolloClient';
import { RejectSignupRequestDocument } from '../../mutations.generated';

export const action: ActionFunction = async ({ params: { id } }) => {
  try {
    return await client.mutate({
      mutation: RejectSignupRequestDocument,
      variables: { id },
    });
  } catch (error) {
    return error;
  }
};

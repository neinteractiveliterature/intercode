import { ActionFunction } from 'react-router';
import { client } from '../../../useIntercodeApolloClient';
import { AcceptSignupRequestDocument } from '../../mutations.generated';

export const action: ActionFunction = async ({ params: { id } }) => {
  try {
    return await client.mutate({
      mutation: AcceptSignupRequestDocument,
      variables: { id },
    });
  } catch (error) {
    return error;
  }
};

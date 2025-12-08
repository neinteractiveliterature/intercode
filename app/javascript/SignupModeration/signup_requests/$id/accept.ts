import { ActionFunction, RouterContextProvider } from 'react-router';
import { apolloClientContext } from '../../../AppContexts';
import { AcceptSignupRequestDocument } from '../../mutations.generated';

export const action: ActionFunction<RouterContextProvider> = async ({ context, params: { id } }) => {
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

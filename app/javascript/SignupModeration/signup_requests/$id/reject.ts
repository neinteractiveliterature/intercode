import { ActionFunction, RouterContextProvider } from 'react-router';
import { apolloClientContext } from '../../../AppContexts';
import { RejectSignupRequestDocument } from '../../mutations.generated';

export const clientAction: ActionFunction<RouterContextProvider> = async ({ context, params: { id } }) => {
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

import { ActionFunction, RouterContextProvider, redirect } from 'react-router';
import { apolloClientContext } from '../AppContexts';
import { DeleteSignupRoundDocument, UpdateSignupRoundDocument } from './mutations.generated';
import { SignupRound } from '../graphqlTypes.generated';
import { buildSignupRoundInputFromFormData } from './buildSignupRoundInput';

export const clientAction: ActionFunction<RouterContextProvider> = async ({ context, request, params: { id } }) => {
  const client = context.get(apolloClientContext);
  try {
    if (request.method === 'DELETE') {
      await client.mutate({
        mutation: DeleteSignupRoundDocument,
        variables: { id: id ?? '' },
        update: (cache) => {
          cache.modify<SignupRound>({
            id: cache.identify({ __typename: 'SignupRound', id: id ?? '' }),
            fields: (value, { DELETE }) => DELETE,
          });
        },
      });
    } else if (request.method === 'PATCH') {
      const formData = await request.formData();
      await client.mutate({
        mutation: UpdateSignupRoundDocument,
        variables: { id: id ?? '', signupRound: buildSignupRoundInputFromFormData(formData) },
      });
    }
  } catch (error) {
    return error;
  }

  return redirect('..');
};

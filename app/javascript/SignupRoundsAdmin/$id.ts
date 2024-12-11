import { ActionFunction, redirect } from 'react-router';
import { client } from '../useIntercodeApolloClient';
import { DeleteSignupRoundDocument, UpdateSignupRoundDocument } from './mutations.generated';
import { SignupRound } from '../graphqlTypes.generated';
import { buildSignupRoundInputFromFormData } from './buildSignupRoundInput';

export async function action({ request, params: { id } }) {
  try {
    if (request.method === 'DELETE') {
      await client.mutate({
        mutation: DeleteSignupRoundDocument,
        variables: { id },
        update: (cache) => {
          cache.modify<SignupRound>({
            id: cache.identify({ __typename: 'SignupRound', id }),
            fields: (value, { DELETE }) => DELETE,
          });
        },
      });
    } else if (request.method === 'PATCH') {
      const formData = await request.formData();
      await client.mutate({
        mutation: UpdateSignupRoundDocument,
        variables: { id, signupRound: buildSignupRoundInputFromFormData(formData) },
      });
    }
  } catch (error) {
    return error;
  }

  return redirect('..');
}

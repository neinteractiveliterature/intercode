import { redirect } from 'react-router';
import { DeleteSignupRoundDocument, UpdateSignupRoundDocument } from './mutations.generated';
import { SignupRound } from '../graphqlTypes.generated';
import { buildSignupRoundInputFromFormData } from './buildSignupRoundInput';
import { Route } from './+types/$id';

export async function action({ request, params: { id }, context }: Route.ActionArgs) {
  try {
    if (request.method === 'DELETE') {
      await context.client.mutate({
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
      await context.client.mutate({
        mutation: UpdateSignupRoundDocument,
        variables: { id, signupRound: buildSignupRoundInputFromFormData(formData) },
      });
    }
  } catch (error) {
    return error;
  }

  return redirect('..');
}

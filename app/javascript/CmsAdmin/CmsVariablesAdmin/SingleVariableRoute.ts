import { ActionFunction, redirect } from 'react-router';
import { client } from '../../useIntercodeApolloClient';
import { DeleteCmsVariableMutationDocument, SetCmsVariableMutationDocument } from './mutations.generated';

export const action: ActionFunction = async ({ params: { key }, request }) => {
  const formData = await request.formData();

  if (request.method === 'POST' || request.method === 'PATCH') {
    await client.mutate({
      mutation: SetCmsVariableMutationDocument,
      variables: {
        key: key ?? '',
        value_json: formData.get('value_json'),
      },
    });
  } else if (request.method === 'DELETE') {
    await client.mutate({
      mutation: DeleteCmsVariableMutationDocument,
      variables: { key: key ?? '' },
    });
  } else {
    return new Response(null, { status: 404 });
  }

  await client.resetStore();
  return redirect('/cms_variables');
};

import { ActionFunction } from 'react-router';
import { client } from '../../useIntercodeApolloClient';
import { DeleteCmsVariableMutationDocument, SetCmsVariableMutationDocument } from './mutations.generated';

export const action: ActionFunction = async ({ params: { key }, request }) => {
  const formData = await request.formData();

  try {
    if (request.method === 'POST' || request.method === 'PATCH') {
      const { data } = await client.mutate({
        mutation: SetCmsVariableMutationDocument,
        variables: {
          key: key ?? '',
          value_json: formData.get('value_json'),
        },
      });
      await client.resetStore();
      return data;
    } else if (request.method === 'DELETE') {
      const { data } = await client.mutate({
        mutation: DeleteCmsVariableMutationDocument,
        variables: { key: key ?? '' },
      });
      await client.resetStore();
      return data;
    } else {
      return new Response(null, { status: 404 });
    }
  } catch (error) {
    return error;
  }
};

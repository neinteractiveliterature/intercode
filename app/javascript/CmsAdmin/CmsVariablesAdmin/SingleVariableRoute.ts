import { data } from 'react-router';
import { DeleteCmsVariableMutationDocument, SetCmsVariableMutationDocument } from './mutations.generated';
import { Route } from './+types/SingleVariableRoute';

export async function action({ params: { key }, request, context }: Route.ActionArgs) {
  const formData = await request.formData();
  const { client } = context;

  try {
    if (request.method === 'POST' || request.method === 'PATCH') {
      const result = await client.mutate({
        mutation: SetCmsVariableMutationDocument,
        variables: {
          key: key ?? '',
          value_json: formData.get('value_json'),
        },
      });
      await client.resetStore();
      return data(result.data);
    } else if (request.method === 'DELETE') {
      const result = await client.mutate({
        mutation: DeleteCmsVariableMutationDocument,
        variables: { key: key ?? '' },
      });
      await client.resetStore();
      return data(result.data);
    } else {
      return new Response(null, { status: 404 });
    }
  } catch (error) {
    return error;
  }
}

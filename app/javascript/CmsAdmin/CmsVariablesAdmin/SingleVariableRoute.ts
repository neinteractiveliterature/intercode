import { redirect } from 'react-router';
import { DeleteCmsVariableMutationDocument, SetCmsVariableMutationDocument } from './mutations.generated';
import { Route } from './+types/SingleVariableRoute';

export async function action({ params: { key }, request, context }: Route.ActionArgs) {
  const formData = await request.formData();

  if (request.method === 'POST' || request.method === 'PATCH') {
    await context.client.mutate({
      mutation: SetCmsVariableMutationDocument,
      variables: {
        key: key ?? '',
        value_json: formData.get('value_json'),
      },
    });
  } else if (request.method === 'DELETE') {
    await context.client.mutate({
      mutation: DeleteCmsVariableMutationDocument,
      variables: { key: key ?? '' },
    });
  } else {
    return new Response(null, { status: 404 });
  }

  await context.client.resetStore();
  return redirect('/cms_variables');
}

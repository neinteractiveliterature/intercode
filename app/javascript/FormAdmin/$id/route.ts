import { redirect } from 'react-router';
import { DeleteFormDocument } from '../mutations.generated';
import { Form } from '../../graphqlTypes.generated';
import { Route } from './+types/route';

export async function action({ params: { id }, request, context }: Route.ActionArgs) {
  try {
    if (request.method === 'DELETE') {
      await context.client.mutate({
        mutation: DeleteFormDocument,
        variables: {
          id,
        },
        update: (cache) => {
          cache.modify<Form>({
            id: cache.identify({ __typename: 'Form', id }),
            fields: (a, { DELETE }) => DELETE,
          });
        },
      });
      return redirect('/admin_forms');
    } else {
      return new Response(null, { status: 404 });
    }
  } catch (error) {
    return error;
  }
}

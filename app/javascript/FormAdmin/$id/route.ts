import { ActionFunction, redirect } from 'react-router';
import { client } from '../../useIntercodeApolloClient';
import { DeleteFormDocument } from '../mutations.generated';
import { Form } from '../../graphqlTypes.generated';

export async function action({ params: { id }, request }) {
  try {
    if (request.method === 'DELETE') {
      await client.mutate({
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

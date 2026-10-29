import { ActionFunction, RouterContextProvider, redirect } from 'react-router';
import { apolloClientContext } from '../../AppContexts';
import { DeleteFormDocument } from '../mutations.generated';
import { Form } from '../../graphqlTypes.generated';

export const clientAction: ActionFunction<RouterContextProvider> = async ({ context, params: { id }, request }) => {
  const client = context.get(apolloClientContext);
  try {
    if (request.method === 'DELETE') {
      await client.mutate({
        mutation: DeleteFormDocument,
        variables: {
          id: id ?? '',
        },
        update: (cache) => {
          cache.modify<Form>({
            id: cache.identify({ __typename: 'Form', id: id ?? '' }),
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
};

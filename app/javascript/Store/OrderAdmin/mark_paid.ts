import { ActionFunction, data } from 'react-router';
import { client } from 'useIntercodeApolloClient';
import { MarkOrderPaidDocument } from './mutations.generated';
import invariant from 'tiny-invariant';

export const action: ActionFunction = async ({ params: { id }, request }) => {
  invariant(id != null);

  try {
    if (request.method === 'PATCH') {
      const result = await client.mutate({
        mutation: MarkOrderPaidDocument,
        variables: { orderId: id },
      });
      return data(result.data);
    } else {
      return new Response(null, { status: 404 });
    }
  } catch (error) {
    return error;
  }
};

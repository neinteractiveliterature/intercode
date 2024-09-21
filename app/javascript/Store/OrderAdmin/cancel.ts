import { ActionFunction, json } from 'react-router';
import { client } from 'useIntercodeApolloClient';
import { CancelOrderDocument } from './mutations.generated';
import invariant from 'tiny-invariant';

export const action: ActionFunction = async ({ params: { id }, request }) => {
  invariant(id != null);

  try {
    if (request.method === 'PATCH') {
      const formData = await request.formData();
      const skipRefund = formData.get('skip_refund')?.toString() === 'true';

      const { data } = await client.mutate({
        mutation: CancelOrderDocument,
        variables: { orderId: id, skipRefund },
      });
      return json(data);
    } else {
      return new Response(null, { status: 404 });
    }
  } catch (error) {
    return error;
  }
};

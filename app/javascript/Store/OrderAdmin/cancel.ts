import { ActionFunction, RouterContextProvider, data } from 'react-router';
import { apolloClientContext } from '../../AppContexts';
import { CancelOrderDocument } from './mutations.generated';
import invariant from 'tiny-invariant';

export const clientAction: ActionFunction<RouterContextProvider> = async ({ context, params: { id }, request }) => {
  const client = context.get(apolloClientContext);
  invariant(id != null);

  try {
    if (request.method === 'PATCH') {
      const formData = await request.formData();
      const skipRefund = formData.get('skip_refund')?.toString() === 'true';

      const result = await client.mutate({
        mutation: CancelOrderDocument,
        variables: { orderId: id, skipRefund },
      });
      return data(result.data);
    } else {
      return new Response(null, { status: 404 });
    }
  } catch (error) {
    return error;
  }
};

import { ActionFunction, RouterContextProvider, data } from 'react-router';
import { apolloClientContext } from '../../AppContexts';
import { MarkOrderPaidDocument } from './mutations.generated';
import invariant from 'tiny-invariant';

export const action: ActionFunction<RouterContextProvider> = async ({ context, params: { id }, request }) => {
  const client = context.get(apolloClientContext);
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

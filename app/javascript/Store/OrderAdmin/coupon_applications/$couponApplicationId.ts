import { ActionFunction, RouterContextProvider, data } from 'react-router';
import { DeleteCouponApplicationDocument } from 'Store/mutations.generated';
import { apolloClientContext } from '../../../AppContexts';

export const action: ActionFunction<RouterContextProvider> = async ({ context, params: { id }, request }) => {
  const client = context.get(apolloClientContext);
  try {
    if (request.method === 'DELETE') {
      const result = await client.mutate({
        mutation: DeleteCouponApplicationDocument,
        variables: { id: id ?? '' },
      });
      await client.resetStore();
      return data(result.data);
    } else {
      return new Response(null, { status: 404 });
    }
  } catch (error) {
    return error;
  }
};

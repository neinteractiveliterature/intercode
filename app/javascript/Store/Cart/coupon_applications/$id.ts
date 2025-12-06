import { ActionFunction, RouterContextProvider, data } from 'react-router';
import { DeleteCouponApplicationDocument } from 'Store/mutations.generated';
import { apolloClientContext } from '../../../AppContexts';
import { CartQueryDocument } from '../queries.generated';

export const action: ActionFunction<RouterContextProvider> = async ({ context, params: { id }, request }) => {
  const client = context.get(apolloClientContext);
  try {
    if (request.method === 'DELETE') {
      const result = await client.mutate({
        mutation: DeleteCouponApplicationDocument,
        variables: { id: id ?? '' },
        refetchQueries: [{ query: CartQueryDocument }],
        awaitRefetchQueries: true,
      });
      return data(result.data);
    } else {
      return new Response(null, { status: 404 });
    }
  } catch (error) {
    return error;
  }
};

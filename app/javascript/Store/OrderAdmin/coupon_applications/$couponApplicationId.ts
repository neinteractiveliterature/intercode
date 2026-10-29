import { data } from 'react-router';
import { DeleteCouponApplicationDocument } from 'Store/mutations.generated';
import { apolloClientContext } from '../../../AppContexts';
import type { Route } from './+types/$couponApplicationId';

export const clientAction = async ({ context, params: { id }, request }: Route.ClientActionArgs) => {
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

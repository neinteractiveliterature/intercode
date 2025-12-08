import { ActionFunction, RouterContextProvider, data } from 'react-router';
import { CreateCouponApplicationDocument } from 'Store/mutations.generated';
import invariant from 'tiny-invariant';
import { apolloClientContext } from '../../../AppContexts';
import { CartQueryDocument } from '../queries.generated';

export const action: ActionFunction<RouterContextProvider> = async ({ context, request }) => {
  const client = context.get(apolloClientContext);
  try {
    if (request.method === 'POST') {
      const formData = await request.formData();
      const orderId = formData.get('order_id')?.toString();
      const couponCode = formData.get('coupon_code')?.toString();
      invariant(orderId != null);

      const result = await client.mutate({
        mutation: CreateCouponApplicationDocument,
        variables: { orderId: orderId ?? '', couponCode: couponCode ?? '' },
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

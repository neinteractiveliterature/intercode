import { ActionFunction, json } from 'react-router';
import { CreateCouponApplicationDocument } from 'Store/mutations.generated';
import invariant from 'tiny-invariant';
import { client } from 'useIntercodeApolloClient';
import { CartQueryDocument } from '../queries.generated';

export const action: ActionFunction = async ({ request }) => {
  try {
    if (request.method === 'POST') {
      const formData = await request.formData();
      const orderId = formData.get('order_id')?.toString();
      const couponCode = formData.get('coupon_code')?.toString();
      invariant(orderId != null);

      const { data } = await client.mutate({
        mutation: CreateCouponApplicationDocument,
        variables: { orderId, couponCode },
        refetchQueries: [{ query: CartQueryDocument }],
        awaitRefetchQueries: true,
      });
      return json(data);
    } else {
      return new Response(null, { status: 404 });
    }
  } catch (error) {
    return error;
  }
};

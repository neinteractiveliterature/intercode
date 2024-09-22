import { ActionFunction, json } from 'react-router';
import { CreateCouponApplicationDocument } from 'Store/mutations.generated';
import invariant from 'tiny-invariant';
import { client } from 'useIntercodeApolloClient';

export const action: ActionFunction = async ({ request, params: { id } }) => {
  invariant(id != null);

  try {
    if (request.method === 'POST') {
      const formData = await request.formData();
      const couponCode = formData.get('coupon_code')?.toString();

      const { data } = await client.mutate({
        mutation: CreateCouponApplicationDocument,
        variables: { orderId: id, couponCode },
      });
      await client.resetStore();
      return json(data);
    } else {
      return new Response(null, { status: 404 });
    }
  } catch (error) {
    return error;
  }
};

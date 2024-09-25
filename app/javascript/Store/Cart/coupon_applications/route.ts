import { data } from 'react-router';
import { CreateCouponApplicationDocument } from 'Store/mutations.generated';
import invariant from 'tiny-invariant';
import { CartQueryDocument } from '../queries.generated';
import { Route } from './+types/route';

export async function action({ request, context }: Route.ActionArgs) {
  try {
    if (request.method === 'POST') {
      const formData = await request.formData();
      const orderId = formData.get('order_id')?.toString();
      const couponCode = formData.get('coupon_code')?.toString();
      invariant(orderId != null);

      const result = await context.client.mutate({
        mutation: CreateCouponApplicationDocument,
        variables: { orderId, couponCode },
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
}

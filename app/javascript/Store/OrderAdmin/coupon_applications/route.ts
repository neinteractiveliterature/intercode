import { data } from 'react-router';
import { CreateCouponApplicationDocument } from 'Store/mutations.generated';
import { Route } from './+types/route';

export async function action({ request, params: { id }, context }: Route.ActionArgs) {
  try {
    if (request.method === 'POST') {
      const formData = await request.formData();
      const couponCode = formData.get('coupon_code')?.toString();

      const result = await context.client.mutate({
        mutation: CreateCouponApplicationDocument,
        variables: { orderId: id, couponCode },
      });
      await context.client.resetStore();
      return data(result.data);
    } else {
      return new Response(null, { status: 404 });
    }
  } catch (error) {
    return error;
  }
}

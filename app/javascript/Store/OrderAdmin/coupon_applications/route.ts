import { data } from 'react-router';
import { Route } from './+types/route';
import { CreateCouponApplicationDocument } from '~/Store/mutations.generated';
import invariant from 'tiny-invariant';
import { apolloClientContext } from '../../../AppContexts';

export const clientAction = async ({ context, request, params: { id } }: Route.ClientActionArgs) => {
  const client = context.get(apolloClientContext);
  invariant(id != null);

  try {
    if (request.method === 'POST') {
      const formData = await request.formData();
      const couponCode = formData.get('coupon_code')?.toString();

      const result = await client.mutate({
        mutation: CreateCouponApplicationDocument,
        variables: { orderId: id ?? '', couponCode: couponCode ?? '' },
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

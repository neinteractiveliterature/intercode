import { ActionFunction, RouterContextProvider, data } from 'react-router';
import { CreateCouponApplicationDocument } from '~/Store/mutations.generated';
import invariant from 'tiny-invariant';
import { apolloClientContext } from '../../../AppContexts';

export const action: ActionFunction<RouterContextProvider> = async ({ context, request, params: { id } }) => {
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

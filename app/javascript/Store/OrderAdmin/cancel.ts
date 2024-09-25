import { data } from 'react-router';
import { CancelOrderDocument } from './mutations.generated';
import { Route } from './+types/cancel';

export async function action({ params: { id }, request, context }: Route.ActionArgs) {
  try {
    if (request.method === 'PATCH') {
      const formData = await request.formData();
      const skipRefund = formData.get('skip_refund')?.toString() === 'true';

      const result = await context.client.mutate({
        mutation: CancelOrderDocument,
        variables: { orderId: id, skipRefund },
      });
      return data(result);
    } else {
      return new Response(null, { status: 404 });
    }
  } catch (error) {
    return error;
  }
}

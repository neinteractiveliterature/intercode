import { data } from 'react-router';
import { MarkOrderPaidDocument } from './mutations.generated';
import { Route } from './+types/mark_paid';

export async function action({ params: { id }, request, context }: Route.ActionArgs) {
  try {
    if (request.method === 'PATCH') {
      const result = await context.client.mutate({
        mutation: MarkOrderPaidDocument,
        variables: { orderId: id },
      });
      return data(result.data);
    } else {
      return new Response(null, { status: 404 });
    }
  } catch (error) {
    return error;
  }
}

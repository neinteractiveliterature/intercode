import { data } from 'react-router';
import { AdminCreateOrderEntryDocument } from '../mutations.generated';
import { OrderEntryInput } from 'graphqlTypes.generated';
import { Route } from './+types/route';

export async function action({ request, params: { id }, context }: Route.ActionArgs) {
  try {
    if (request.method === 'POST') {
      const orderEntry = (await request.json()) as OrderEntryInput;

      const result = await context.client.mutate({
        mutation: AdminCreateOrderEntryDocument,
        variables: { input: { orderId: id, order_entry: orderEntry } },
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

import { data } from 'react-router';
import { Route } from './+types/route';
import invariant from 'tiny-invariant';
import { apolloClientContext } from '../../../AppContexts';
import { AdminCreateOrderEntryDocument } from '../mutations.generated';
import { OrderEntryInput } from '~/graphqlTypes.generated';

export const clientAction = async ({ context, request, params: { id } }: Route.ClientActionArgs) => {
  const client = context.get(apolloClientContext);
  invariant(id != null);

  try {
    if (request.method === 'POST') {
      const orderEntry = (await request.json()) as OrderEntryInput;

      const result = await client.mutate({
        mutation: AdminCreateOrderEntryDocument,
        variables: { input: { orderId: id, order_entry: orderEntry } },
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

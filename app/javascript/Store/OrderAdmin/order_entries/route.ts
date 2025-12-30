import { ActionFunction, RouterContextProvider, data } from 'react-router';
import invariant from 'tiny-invariant';
import { apolloClientContext } from '../../../AppContexts';
import { AdminCreateOrderEntryDocument } from '../mutations.generated';
import { OrderEntryInput } from '~/graphqlTypes.generated';

export const clientAction: ActionFunction<RouterContextProvider> = async ({ context, request, params: { id } }) => {
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

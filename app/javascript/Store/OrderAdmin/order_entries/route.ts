import { ActionFunction, data } from 'react-router';
import invariant from 'tiny-invariant';
import { client } from 'useIntercodeApolloClient';
import { AdminCreateOrderEntryDocument } from '../mutations.generated';
import { OrderEntryInput } from 'graphqlTypes.generated';

export const action: ActionFunction = async ({ request, params: { id } }) => {
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

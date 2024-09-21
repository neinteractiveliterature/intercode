import { OrderEntry } from 'graphqlTypes.generated';
import { ActionFunction, json } from 'react-router';
import { DeleteOrderEntryDocument, UpdateOrderEntryDocument } from 'Store/OrderAdmin/mutations.generated';
import { client } from 'useIntercodeApolloClient';

export const action: ActionFunction = async ({ params: { id }, request }) => {
  try {
    if (request.method === 'DELETE') {
      const { data } = await client.mutate({
        mutation: DeleteOrderEntryDocument,
        variables: { input: { id } },
        update: (cache) => {
          cache.modify<OrderEntry>({
            id: cache.identify({ __typename: 'OrderEntry', id }),
            fields: (value, { DELETE }) => DELETE,
          });
        },
      });
      return json(data);
    } else if (request.method === 'PATCH') {
      const formData = await request.formData();
      const { data } = await client.mutate({
        mutation: UpdateOrderEntryDocument,
        variables: {
          input: { id, order_entry: { quantity: Number.parseInt(formData.get('quantity')?.toString() ?? '') } },
        },
      });
      return json(data);
    } else {
      return new Response(null, { status: 404 });
    }
  } catch (error) {
    return error;
  }
};

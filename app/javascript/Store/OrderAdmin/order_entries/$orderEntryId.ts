import { OrderEntry, OrderEntryInput } from 'graphqlTypes.generated';
import { ActionFunction, json } from 'react-router';
import { AdminDeleteOrderEntryDocument, AdminUpdateOrderEntryDocument } from 'Store/OrderAdmin/mutations.generated';
import { client } from 'useIntercodeApolloClient';

export const action: ActionFunction = async ({ params: { orderEntryId }, request }) => {
  try {
    if (request.method === 'DELETE') {
      const { data } = await client.mutate({
        mutation: AdminDeleteOrderEntryDocument,
        variables: { input: { id: orderEntryId } },
        update: (cache) => {
          cache.modify<OrderEntry>({
            id: cache.identify({ __typename: 'OrderEntry', id: orderEntryId }),
            fields: (value, { DELETE }) => DELETE,
          });
        },
      });
      return json(data);
    } else if (request.method === 'PATCH') {
      const orderEntry = (await request.json()) as OrderEntryInput;
      const { data } = await client.mutate({
        mutation: AdminUpdateOrderEntryDocument,
        variables: {
          input: { id: orderEntryId, order_entry: orderEntry },
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

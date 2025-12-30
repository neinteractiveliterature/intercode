import { OrderEntry } from '~/graphqlTypes.generated';
import { data } from 'react-router';
import { Route } from './+types/$id';
import { DeleteOrderEntryDocument, UpdateOrderEntryDocument } from '~/Store/OrderAdmin/mutations.generated';
import { apolloClientContext } from '../../../AppContexts';

export const clientAction = async ({ context, params: { id }, request }: Route.ClientActionArgs) => {
  const client = context.get(apolloClientContext);
  try {
    if (request.method === 'DELETE') {
      const result = await client.mutate({
        mutation: DeleteOrderEntryDocument,
        variables: { input: { id } },
        update: (cache) => {
          cache.modify<OrderEntry>({
            id: cache.identify({ __typename: 'OrderEntry', id }),
            fields: (value, { DELETE }) => DELETE,
          });
        },
      });
      return data(result.data);
    } else if (request.method === 'PATCH') {
      const formData = await request.formData();
      const result = await client.mutate({
        mutation: UpdateOrderEntryDocument,
        variables: {
          input: { id, order_entry: { quantity: Number.parseInt(formData.get('quantity')?.toString() ?? '') } },
        },
      });
      return data(result.data);
    } else {
      return new Response(null, { status: 404 });
    }
  } catch (error) {
    return error;
  }
};

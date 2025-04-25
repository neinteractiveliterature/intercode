import { OrderEntry } from 'graphqlTypes.generated';
import { data } from 'react-router';
import { DeleteOrderEntryDocument, UpdateOrderEntryDocument } from 'Store/OrderAdmin/mutations.generated';
import { Route } from './+types/$id';
import { apolloClientContext } from 'AppContexts';

export async function action({ params: { id }, request, context }: Route.ActionArgs) {
  try {
    if (request.method === 'DELETE') {
      const result = await context.get(apolloClientContext).mutate({
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
      const result = await context.get(apolloClientContext).mutate({
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
}

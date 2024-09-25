import { TicketType } from 'graphqlTypes.generated';
import { data } from 'react-router';
import { DeleteTicketTypeDocument } from './mutations.generated';
import { Route } from './+types/$id';

export const action = async ({ params: { id }, request, context }: Route.ActionArgs) => {
  try {
    if (request.method === 'DELETE') {
      const result = await context.client.mutate({
        mutation: DeleteTicketTypeDocument,
        variables: { input: { id } },
        update: (cache) => {
          cache.modify<TicketType>({
            id: cache.identify({ __typename: 'TicketType', id }),
            fields: (value, { DELETE }) => DELETE,
          });
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

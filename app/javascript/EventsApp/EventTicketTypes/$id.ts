import { TicketType } from 'graphqlTypes.generated';
import { data } from 'react-router';
import { Route } from './+types/$id';
import { DeleteTicketTypeDocument } from 'TicketTypeAdmin/mutations.generated';
import { apolloClientContext } from 'AppContexts';

export const action = async ({ params: { id }, request, context }: Route.ActionArgs) => {
  try {
    if (request.method === 'DELETE') {
      const result = await context.get(apolloClientContext).mutate({
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

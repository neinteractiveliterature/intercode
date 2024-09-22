import { TicketType, TicketTypeInput } from 'graphqlTypes.generated';
import { ActionFunction, json } from 'react-router';
import invariant from 'tiny-invariant';
import { client } from 'useIntercodeApolloClient';
import { DeleteTicketTypeDocument, UpdateTicketTypeDocument } from './mutations.generated';

export const action: ActionFunction = async ({ params: { id }, request }) => {
  invariant(id != null);
  try {
    if (request.method === 'DELETE') {
      const { data } = await client.mutate({
        mutation: DeleteTicketTypeDocument,
        variables: { input: { id } },
        update: (cache) => {
          cache.modify<TicketType>({
            id: cache.identify({ __typename: 'TicketType', id }),
            fields: (value, { DELETE }) => DELETE,
          });
        },
      });
      return json(data);
    } else if (request.method === 'PATCH') {
      const ticketType = (await request.json()) as TicketTypeInput;
      const { data } = await client.mutate({
        mutation: UpdateTicketTypeDocument,
        variables: { input: { ticket_type: ticketType } },
      });
      return json(data);
    } else {
      return new Response(null, { status: 404 });
    }
  } catch (error) {
    return error;
  }
};

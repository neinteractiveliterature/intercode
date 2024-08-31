import { ActionFunction } from 'react-router';
import { client } from '../../useIntercodeApolloClient';
import { CreateMaximumEventProvidedTicketsOverrideDocument } from '../../EventAdmin/mutations.generated';

export const action: ActionFunction = async ({ request, params: { eventId } }) => {
  try {
    if (request.method === 'POST') {
      const formData = await request.formData();
      await client.mutate({
        mutation: CreateMaximumEventProvidedTicketsOverrideDocument,
        variables: {
          input: {
            eventId: eventId ?? '',
            ticketTypeId: formData.get('ticket_type_id')?.toString(),
            override_value: Number.parseInt(formData.get('override_value')?.toString() ?? ''),
          },
        },
        update: (cache) => {
          cache.modify({
            id: cache.identify({ __typename: 'Event', id: eventId }),
            fields(fieldValue, details) {
              return details.INVALIDATE;
            },
          });
        },
      });
    } else {
      return new Response(null, { status: 404 });
    }
  } catch (error) {
    return error;
  }
};

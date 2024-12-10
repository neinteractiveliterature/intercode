import { ActionFunction, data } from 'react-router';
import { CreateMaximumEventProvidedTicketsOverrideDocument } from '../../EventAdmin/mutations.generated';
import { Route } from './+types/route';

export const action: ActionFunction = async ({ request, params: { eventId }, context }: Route.ActionArgs) => {
  try {
    if (request.method === 'POST') {
      const formData = await request.formData();
      const result = await context.client.mutate({
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

      return data(result.data);
    } else {
      return new Response(null, { status: 404 });
    }
  } catch (error) {
    return error;
  }
};

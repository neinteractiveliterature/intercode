import { CreateTicketTypeDocument } from 'TicketTypeAdmin/mutations.generated';
import { Route } from './+types/new';
import updateCacheAfterCreateTicketType from 'TicketTypeAdmin/updateCacheAfterCreateTicketType';
import { Event } from 'graphqlTypes.generated';
import { replace } from 'react-router';
import { loader as layoutLoader } from './route';
import NewTicketType from 'TicketTypeAdmin/NewTicketType';

export async function action({ context, request, params: { eventId } }: Route.ActionArgs) {
  try {
    const { ticketType } = await request.json();
    await context.client.mutate({
      mutation: CreateTicketTypeDocument,
      variables: {
        input: { ticket_type: ticketType, eventId },
      },
      update: updateCacheAfterCreateTicketType((cache, ref) => {
        cache.modify<Event>({
          id: cache.identify({ __typename: 'Event', id: eventId }),
          fields: {
            ticket_types: (value) => [...value, ref],
          },
        });
      }),
    });

    return replace('..');
  } catch (error) {
    return error;
  }
}

export const loader = layoutLoader satisfies (args: Route.LoaderArgs) => unknown;

export default function NewEventTicketType({ loaderData: { parent, ticketTypes } }: Route.ComponentProps) {
  return <NewTicketType parent={parent} ticketTypes={ticketTypes} />;
}

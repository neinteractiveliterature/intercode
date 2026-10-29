import { apolloClientContext } from 'AppContexts';
import { AdminTicketTypesQueryDocument, EventTicketTypesQueryDocument } from './queries.generated';
import { LoaderFunctionArgs } from 'react-router';

// The same pages work for a convention's ticket types and for an event's, so they take either loader's result
export type TicketTypesLoader = typeof adminTicketTypesLoader | typeof eventTicketTypesLoader;
export type SingleTicketTypeLoader = typeof adminSingleTicketTypeLoader | typeof eventSingleTicketTypeLoader;

export const adminTicketTypesLoader = async ({ context }: LoaderFunctionArgs) => {
  const client = context.get(apolloClientContext);
  const { data } = await client.query({ query: AdminTicketTypesQueryDocument, errorPolicy: 'none' });
  return { parent: data.convention, ticketTypes: data.convention.ticket_types };
};

export const eventTicketTypesLoader = async ({ context, params: { eventId } }: LoaderFunctionArgs) => {
  const client = context.get(apolloClientContext);
  const { data } = await client.query({
    query: EventTicketTypesQueryDocument,
    variables: { id: eventId ?? '' },
    errorPolicy: 'none',
  });
  return { parent: data.convention.event, ticketTypes: data.convention.event.ticket_types };
};

function getSingleTicketType<TicketType extends { id: string }>(ticketTypes: TicketType[], id: string) {
  const ticketType = ticketTypes.find((ticketType) => ticketType.id === id);
  if (!ticketType) {
    throw new Response(null, { status: 404 });
  }

  return ticketType;
}

export const adminSingleTicketTypeLoader = async (args: LoaderFunctionArgs) => {
  const { ticketTypes } = await adminTicketTypesLoader(args);
  return getSingleTicketType(ticketTypes, args.params.id ?? '');
};

export const eventSingleTicketTypeLoader = async (args: LoaderFunctionArgs) => {
  const { ticketTypes } = await eventTicketTypesLoader(args);
  return getSingleTicketType(ticketTypes, args.params.id ?? '');
};

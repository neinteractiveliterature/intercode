import {
  AdminTicketTypesQueryData,
  AdminTicketTypesQueryDocument,
  EventTicketTypesQueryData,
  EventTicketTypesQueryDocument,
  EventTicketTypesQueryVariables,
} from './queries.generated';
import { LoaderFunction } from 'react-router';
import { client } from '../useIntercodeApolloClient';

export type TicketTypeLoaderResult = {
  parent: AdminTicketTypesQueryData['convention'] | EventTicketTypesQueryData['convention']['event'];
  ticketTypes:
    | AdminTicketTypesQueryData['convention']['ticket_types']
    | EventTicketTypesQueryData['convention']['event']['ticket_types'];
};

export const adminTicketTypesLoader: LoaderFunction = async () => {
  const { data } = await client.query<AdminTicketTypesQueryData>({ query: AdminTicketTypesQueryDocument });
  return { parent: data.convention, ticketTypes: data.convention.ticket_types } as TicketTypeLoaderResult;
};

export const eventTicketTypesLoader: LoaderFunction = async ({ params: { eventId } }) => {
  const { data } = await client.query<EventTicketTypesQueryData, EventTicketTypesQueryVariables>({
    query: EventTicketTypesQueryDocument,
    variables: { id: eventId ?? '' },
  });
  return { parent: data.convention.event, ticketTypes: data.convention.event.ticket_types } as TicketTypeLoaderResult;
};

export type SingleTicketTypeLoaderResult = TicketTypeLoaderResult['ticketTypes'][number];

function getSingleTicketType(ticketTypes: TicketTypeLoaderResult['ticketTypes'], id: string) {
  const ticketType = ticketTypes.find((ticketType) => ticketType.id === id);
  if (!ticketType) {
    return new Response(null, { status: 404 });
  }

  return ticketType;
}

export const adminSingleTicketTypeLoader: LoaderFunction = async ({ request, params: { id } }) => {
  const { ticketTypes } = (await adminTicketTypesLoader({
    params: {},
    request,
    context: {},
  })) as TicketTypeLoaderResult;
  return getSingleTicketType(ticketTypes, id ?? '');
};

export const eventSingleTicketTypeLoader: LoaderFunction = async ({ request, params: { id, eventId } }) => {
  const { ticketTypes } = (await eventTicketTypesLoader({
    params: { eventId },
    request,
    context: {},
  })) as TicketTypeLoaderResult;
  return getSingleTicketType(ticketTypes, id ?? '');
};

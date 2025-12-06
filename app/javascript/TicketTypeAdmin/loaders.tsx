import { apolloClientContext } from 'AppContexts';
import {
  AdminTicketTypesQueryData,
  AdminTicketTypesQueryDocument,
  EventTicketTypesQueryData,
  EventTicketTypesQueryDocument,
  EventTicketTypesQueryVariables,
} from './queries.generated';
import { LoaderFunction, RouterContextProvider } from 'react-router';

export type TicketTypeLoaderResult = {
  parent: AdminTicketTypesQueryData['convention'] | EventTicketTypesQueryData['convention']['event'];
  ticketTypes:
    | AdminTicketTypesQueryData['convention']['ticket_types']
    | EventTicketTypesQueryData['convention']['event']['ticket_types'];
};

export const adminTicketTypesLoader: LoaderFunction<RouterContextProvider> = async ({ context }) => {
  const client = context.get(apolloClientContext);
  const { data } = await client.query<AdminTicketTypesQueryData>({ query: AdminTicketTypesQueryDocument });
  return { parent: data?.convention, ticketTypes: data?.convention.ticket_types } as TicketTypeLoaderResult;
};

export const eventTicketTypesLoader: LoaderFunction<RouterContextProvider> = async ({
  context,
  params: { eventId },
}) => {
  const client = context.get(apolloClientContext);
  const { data } = await client.query<EventTicketTypesQueryData, EventTicketTypesQueryVariables>({
    query: EventTicketTypesQueryDocument,
    variables: { id: eventId ?? '' },
  });
  return { parent: data?.convention.event, ticketTypes: data?.convention.event.ticket_types } as TicketTypeLoaderResult;
};

export type SingleTicketTypeLoaderResult = TicketTypeLoaderResult['ticketTypes'][number];

function getSingleTicketType(ticketTypes: TicketTypeLoaderResult['ticketTypes'], id: string) {
  const ticketType = ticketTypes.find((ticketType) => ticketType.id === id);
  if (!ticketType) {
    return new Response(null, { status: 404 });
  }

  return ticketType;
}

export const adminSingleTicketTypeLoader: LoaderFunction = async ({
  context,
  request,
  params: { id },
  unstable_pattern,
}) => {
  const { ticketTypes } = (await adminTicketTypesLoader({
    params: {},
    request,
    context,
    unstable_pattern,
  })) as TicketTypeLoaderResult;
  return getSingleTicketType(ticketTypes, id ?? '');
};

export const eventSingleTicketTypeLoader: LoaderFunction = async ({
  context,
  request,
  params: { id, eventId },
  unstable_pattern,
}) => {
  const { ticketTypes } = (await eventTicketTypesLoader({
    params: { eventId },
    request,
    context,
    unstable_pattern,
  })) as TicketTypeLoaderResult;
  return getSingleTicketType(ticketTypes, id ?? '');
};

import { apolloClientContext } from '~/AppContexts';
import {
  AdminTicketTypesQueryData,
  AdminTicketTypesQueryDocument,
  EventTicketTypesQueryData,
  EventTicketTypesQueryDocument,
} from './queries.generated';
import { Route as AdminRoute } from './+types/route';
import { Route as AdminSingleRoute } from './+types/singleTicketTypeRoute';

export type TicketTypeLoaderResult = {
  parent: AdminTicketTypesQueryData['convention'] | EventTicketTypesQueryData['convention']['event'];
  ticketTypes:
    | AdminTicketTypesQueryData['convention']['ticket_types']
    | EventTicketTypesQueryData['convention']['event']['ticket_types'];
};

export const adminTicketTypesLoader = async ({ context }: AdminRoute.ClientLoaderArgs) => {
  const client = context.get(apolloClientContext);
  const { data } = await client.query({ query: AdminTicketTypesQueryDocument });
  return { parent: data?.convention, ticketTypes: data?.convention.ticket_types } as TicketTypeLoaderResult;
};

export const eventTicketTypesLoader = async ({
  context,
  params: { eventId },
}: { context: any; params: { eventId?: string } }) => {
  const client = context.get(apolloClientContext);
  const { data } = await client.query({
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

export const adminSingleTicketTypeLoader = async ({
  context,
  request,
  params: { id },
  unstable_pattern,
}: AdminSingleRoute.ClientLoaderArgs) => {
  const { ticketTypes } = await adminTicketTypesLoader({
    params: {},
    request,
    context,
    unstable_pattern,
  });
  return getSingleTicketType(ticketTypes, id ?? '');
};

export const eventSingleTicketTypeLoader = async ({
  context,
  request,
  params: { id, eventId },
  unstable_pattern,
}: { context: any; request: any; params: { id?: string; eventId?: string }; unstable_pattern?: any }) => {
  const { ticketTypes } = await eventTicketTypesLoader({
    params: { eventId },
    request,
    context,
    unstable_pattern,
  });
  return getSingleTicketType(ticketTypes, id ?? '');
};

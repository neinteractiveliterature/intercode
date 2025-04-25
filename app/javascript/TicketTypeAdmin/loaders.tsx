import {
  AdminTicketTypesQueryData,
  AdminTicketTypesQueryDocument,
  EventTicketTypesQueryData,
  EventTicketTypesQueryDocument,
  EventTicketTypesQueryVariables,
} from './queries.generated';
import { LoaderFunction } from 'react-router';
import { ApolloClient, NormalizedCacheObject } from '@apollo/client';
import { findById } from 'findById';
import { apolloClientContext } from 'AppContexts';

export type TicketTypeLoaderResult = {
  parent: AdminTicketTypesQueryData['convention'] | EventTicketTypesQueryData['convention']['event'];
  ticketTypes:
    | AdminTicketTypesQueryData['convention']['ticket_types']
    | EventTicketTypesQueryData['convention']['event']['ticket_types'];
};

export const adminTicketTypesLoader: LoaderFunction = async ({ context }) => {
  const client = context.get(apolloClientContext);
  const { data } = await client.query<AdminTicketTypesQueryData>({ query: AdminTicketTypesQueryDocument });
  return { parent: data.convention, ticketTypes: data.convention.ticket_types } as TicketTypeLoaderResult;
};

export const eventTicketTypesLoader: LoaderFunction = async ({ context, params: { eventId } }) => {
  const client = context.get(apolloClientContext);
  const { data } = await client.query<EventTicketTypesQueryData, EventTicketTypesQueryVariables>({
    query: EventTicketTypesQueryDocument,
    variables: { id: eventId ?? '' },
  });
  return { parent: data.convention.event, ticketTypes: data.convention.event.ticket_types } as TicketTypeLoaderResult;
};

export type SingleTicketTypeLoaderResult = TicketTypeLoaderResult['ticketTypes'][number];

export const adminSingleTicketTypeLoader: LoaderFunction = async ({ request, params: { id }, context }) => {
  const { ticketTypes } = (await adminTicketTypesLoader({ params: {}, request, context })) as TicketTypeLoaderResult;
  return findById(ticketTypes, id ?? '');
};

export const eventSingleTicketTypeLoader: LoaderFunction = async ({ request, params: { id, eventId }, context }) => {
  const { ticketTypes } = (await eventTicketTypesLoader({
    params: { eventId },
    request,
    context,
  })) as TicketTypeLoaderResult;
  return findById(ticketTypes, id ?? '');
};

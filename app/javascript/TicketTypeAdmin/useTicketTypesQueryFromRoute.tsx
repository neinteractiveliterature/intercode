import {
  AdminTicketTypesQueryData,
  AdminTicketTypesQueryDocument,
  AdminTicketTypesQueryVariables,
  EventTicketTypesQueryData,
  EventTicketTypesQueryDocument,
  EventTicketTypesQueryVariables,
} from './queries.generated';
import { DocumentNode } from 'graphql';
// eslint-disable-next-line no-restricted-imports
import { useQuery } from '@apollo/client';
import { useMatch } from 'react-router';

export function useEventIdFromRoute() {
  const eventMatch = useMatch('/events/:id/ticket_types/*');
  return eventMatch?.params.id;
}

export function useTicketTypesQueryFromRoute() {
  const eventId = useEventIdFromRoute();
  let query: DocumentNode;
  let variables: EventTicketTypesQueryVariables | AdminTicketTypesQueryVariables;

  if (eventId) {
    query = EventTicketTypesQueryDocument;
    variables = { id: eventId };
  } else {
    query = AdminTicketTypesQueryDocument;
    variables = {};
  }

  return useQuery<
    EventTicketTypesQueryData | AdminTicketTypesQueryData,
    EventTicketTypesQueryVariables | AdminTicketTypesQueryVariables
  >(query, { variables });
}

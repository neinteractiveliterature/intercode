import { TeamMembersQueryData } from './queries.generated';

type ConventionType = Pick<NonNullable<TeamMembersQueryData['convention']>, 'ticket_types'>;
type EventType = {
  provided_tickets: Pick<TeamMembersQueryData['convention']['event']['provided_tickets'][0], 'ticket_type'>[];
};

export function getProvidableTicketTypes(convention: ConventionType): ConventionType['ticket_types'] {
  return convention.ticket_types.filter((ticketType) => ticketType.maximum_event_provided_tickets > 0);
}

export function getProvidedTicketCountByType(
  convention: ConventionType,
  event: EventType,
): { [ticketTypeId: number]: number } {
  return Object.assign(
    {},
    ...getProvidableTicketTypes(convention).map((ticketType) => ({
      [ticketType.id]: event.provided_tickets.filter((ticket) => ticket.ticket_type.id === ticketType.id).length,
    })),
  );
}

export function getRemainingTicketCountByType(
  convention: ConventionType,
  event: EventType,
): { [ticketTypeId: string]: number } {
  const providableTicketTypes = getProvidableTicketTypes(convention);
  const providedTicketCountsByType = getProvidedTicketCountByType(convention, event);

  return Object.assign(
    {},
    ...Object.entries(providedTicketCountsByType).map(([ticketTypeId, providedCount]) => {
      const ticketType = providableTicketTypes.find((tt) => tt.id.toString() === ticketTypeId);
      if (!ticketType) {
        return {};
      }
      return {
        [ticketTypeId]: ticketType.maximum_event_provided_tickets - providedCount,
      };
    }),
  );
}

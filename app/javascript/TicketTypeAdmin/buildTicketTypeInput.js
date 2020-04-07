export default function buildTicketTypeInput(ticketType) {
  return {
    name: ticketType.name,
    maximum_event_provided_tickets: ticketType.maximum_event_provided_tickets,
    counts_towards_convention_maximum: ticketType.counts_towards_convention_maximum,
    allows_event_signups: ticketType.allows_event_signups,
    description: ticketType.description,
  };
}

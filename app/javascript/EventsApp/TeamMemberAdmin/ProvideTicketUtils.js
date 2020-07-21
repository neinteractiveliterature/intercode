export function getProvidableTicketTypes(convention) {
  return convention.ticket_types.filter((
    (ticketType) => ticketType.maximum_event_provided_tickets > 0
  ));
}

export function getProvidedTicketCountByType(convention, event) {
  return Object.assign(
    {},
    ...getProvidableTicketTypes(convention).map((
      (ticketType) => ({
        [ticketType.id]: event.provided_tickets.filter((
          (ticket) => ticket.ticket_type.id === ticketType.id
        )).length,
      })
    )),
  );
}

export function getRemainingTicketCountByType(convention, event) {
  const providableTicketTypes = getProvidableTicketTypes(convention);
  const providedTicketCountsByType = getProvidedTicketCountByType(convention, event);

  return Object.assign(
    {},
    ...Object.entries(providedTicketCountsByType).map(([ticketTypeId, providedCount]) => {
      const ticketType = providableTicketTypes
        .find((ticketType) => ticketType.id.toString() === ticketTypeId);
      return ({
        [ticketTypeId]: ticketType.maximum_event_provided_tickets - providedCount,
      });
    }),
  );
}

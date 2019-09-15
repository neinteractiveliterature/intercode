import { humanize } from 'inflected';

import pluralizeWithCount from '../../pluralizeWithCount';

export const describeTicketType = (ticketType, ticketName) => (
  `${humanize(ticketType.name).toLowerCase()} ${ticketName}`
);

export const describeTicketTypeProvidability = (ticketType, alreadyProvidedCount, ticketName) => {
  const remaining = (
    ticketType.maximum_event_provided_tickets - alreadyProvidedCount
  );

  return pluralizeWithCount(describeTicketType(ticketType, ticketName), remaining);
};

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

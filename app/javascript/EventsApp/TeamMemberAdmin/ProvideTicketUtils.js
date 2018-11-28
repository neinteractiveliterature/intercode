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

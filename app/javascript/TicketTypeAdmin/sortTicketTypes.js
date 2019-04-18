export default function sortTicketTypes(ticketTypes) {
  return [...ticketTypes].sort((
    (a, b) => {
      if (a.publicly_available !== b.publicly_available) {
        if (a.publicly_available) {
          return -1;
        }

        return 1;
      }

      if ((a.maximum_event_provided_tickets > 0) !== (b.maximum_event_provided_tickets > 0)) {
        if (a.maximum_event_provided_tickets > 0) {
          return -1;
        }

        return 1;
      }

      return a.name.localeCompare(b.name, { sensitivity: 'base' });
    }
  ));
}

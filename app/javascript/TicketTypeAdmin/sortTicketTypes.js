export default function sortTicketTypes(ticketTypes) {
  return [...ticketTypes].sort((
    (a, b) => {
      if (a.publicly_available !== b.publicly_available) {
        return (a.publicly_available ? -1 : 1);
      }

      if ((a.maximum_event_provided_tickets > 0) !== (b.maximum_event_provided_tickets > 0)) {
        return (a.maximum_event_provided_tickets > 0 ? -1 : 1);
      }

      return a.name.localeCompare(b.name, { sensitivity: 'base' });
    }
  ));
}

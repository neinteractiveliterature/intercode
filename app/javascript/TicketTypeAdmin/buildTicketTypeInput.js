export default function buildTicketTypeInput(ticketType) {
  return {
    name: ticketType.name,
    publicly_available: ticketType.publicly_available,
    maximum_event_provided_tickets: ticketType.maximum_event_provided_tickets,
    counts_towards_convention_maximum: ticketType.counts_towards_convention_maximum,
    description: ticketType.description,
    pricing_schedule: {
      timespans: ticketType.pricing_schedule.timespans.map(timespan => ({
        start: timespan.start,
        finish: timespan.finish,
        value: {
          fractional: timespan.value.fractional,
          currency_code: timespan.value.currency_code || 'USD',
        },
      })),
    },
  };
}

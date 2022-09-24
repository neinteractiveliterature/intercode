import { Product, TicketType } from '../graphqlTypes.generated';

function ticketTypeHasAvailableProducts(ticketType: { providing_products: Pick<Product, 'available'>[] }) {
  return ticketType.providing_products.some((product) => product.available);
}

export default function sortTicketTypes<
  T extends Pick<TicketType, 'name' | 'maximum_event_provided_tickets'> & {
    providing_products: Pick<Product, 'available'>[];
  },
>(ticketTypes: T[]): T[] {
  return [...ticketTypes].sort((a, b) => {
    const aPubliclyAvailable = ticketTypeHasAvailableProducts(a);
    const bPubliclyAvailable = ticketTypeHasAvailableProducts(b);

    if (aPubliclyAvailable !== bPubliclyAvailable) {
      return aPubliclyAvailable ? -1 : 1;
    }

    if (a.maximum_event_provided_tickets > 0 !== b.maximum_event_provided_tickets > 0) {
      return a.maximum_event_provided_tickets > 0 ? -1 : 1;
    }

    return a.name.localeCompare(b.name, undefined, { sensitivity: 'base' });
  });
}

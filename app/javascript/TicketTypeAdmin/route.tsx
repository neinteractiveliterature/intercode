import { Route } from './+types/route';
import { AdminTicketTypesQueryDocument } from './queries.generated';
import TicketTypesList from './TicketTypesList';

export async function loader({ context }: Route.LoaderArgs) {
  const { data } = await context.client.query({ query: AdminTicketTypesQueryDocument });
  return { parent: data.convention, ticketTypes: data.convention.ticket_types };
}

export default function TicketTypeAdminRoute({ loaderData: { parent, ticketTypes } }: Route.ComponentProps) {
  return <TicketTypesList parent={parent} ticketTypes={ticketTypes} />;
}

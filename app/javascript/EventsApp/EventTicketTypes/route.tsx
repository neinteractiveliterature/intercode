import { loader as layoutLoader } from './layout';
import { Route } from './+types/route';
import TicketTypesList from 'TicketTypeAdmin/TicketTypesList';

export const loader = layoutLoader satisfies (args: Route.LoaderArgs) => unknown;

export default function EventTicketTypesRoute({ loaderData: { parent, ticketTypes } }: Route.ComponentProps) {
  return <TicketTypesList parent={parent} ticketTypes={ticketTypes} />;
}

import { TicketMode } from '../graphqlTypes.generated';
import { guarded, makeAppRootContextGuard } from '../routeGuards';

// Events only have ticket types of their own in ticket-per-event conventions
export const clientLoader = guarded([
  makeAppRootContextGuard(({ convention }) => convention?.ticket_mode === TicketMode.TicketPerEvent),
]);

import { TicketMode } from '../graphqlTypes.generated';
import { guarded, makeAppRootContextGuard } from '../routeGuards';

// The convention has ticket types of its own only when a ticket is required for signup
export const clientLoader = guarded([
  makeAppRootContextGuard(({ convention }) => convention?.ticket_mode === TicketMode.RequiredForSignup),
]);

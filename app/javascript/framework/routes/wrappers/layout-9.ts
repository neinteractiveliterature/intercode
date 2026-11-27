import { TicketMode } from '../../../graphqlTypes.generated';
import { guarded, makeAppRootContextGuard } from '../../../routeGuards';
export const clientLoader = guarded([
  makeAppRootContextGuard(({ convention }) => convention?.ticket_mode === TicketMode.RequiredForSignup),
]);

import { guarded, makeAuthorizationGuard } from '../../../routeGuards';
export const clientLoader = guarded([makeAuthorizationGuard('can_manage_ticket_types')]);

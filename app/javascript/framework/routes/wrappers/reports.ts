import { guarded, makeAuthorizationGuard } from '../../../routeGuards';
export const clientLoader = guarded([makeAuthorizationGuard('can_read_reports')]);

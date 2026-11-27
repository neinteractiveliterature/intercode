import { guarded, makeAuthorizationGuard } from '../../../routeGuards';
export const clientLoader = guarded([makeAuthorizationGuard('can_update_notification_templates')]);

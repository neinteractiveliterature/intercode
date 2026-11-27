import { guarded, loginRequiredGuard } from '../../../routeGuards';
export const clientLoader = guarded([loginRequiredGuard]);

import { editEventGuard, guarded, loginRequiredGuard } from '../../../routeGuards';
export const clientLoader = guarded([editEventGuard, loginRequiredGuard]);

import { eventPageGuard, guarded } from '../../routeGuards';

export const clientLoader = guarded([eventPageGuard]);

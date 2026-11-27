import { guarded, makeAuthorizationGuard } from '../routeGuards';
import { departmentAdminLoader } from './loaders';

export const clientLoader = guarded([makeAuthorizationGuard('can_update_departments')], departmentAdminLoader);

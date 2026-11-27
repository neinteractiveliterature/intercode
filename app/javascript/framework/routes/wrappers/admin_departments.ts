import { departmentAdminLoader } from '../../../DepartmentAdmin/loaders';
import { guarded, makeAuthorizationGuard } from '../../../routeGuards';
export const clientLoader = guarded([makeAuthorizationGuard('can_update_departments')], departmentAdminLoader);

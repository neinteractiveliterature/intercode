import { guarded, makeAppRootContextGuard } from '../../../routeGuards';
export const clientLoader = guarded([makeAppRootContextGuard(({ convention }) => convention?.name != null)]);

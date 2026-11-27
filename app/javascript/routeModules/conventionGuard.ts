import { guarded, makeAppRootContextGuard } from '../routeGuards';

// Pages of any convention
export const clientLoader = guarded([makeAppRootContextGuard(({ convention }) => convention?.name != null)]);

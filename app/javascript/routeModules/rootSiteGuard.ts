import { guarded, makeAppRootContextGuard } from '../routeGuards';

// Pages of the root site
export const clientLoader = guarded([makeAppRootContextGuard(({ convention }) => convention?.name == null)]);

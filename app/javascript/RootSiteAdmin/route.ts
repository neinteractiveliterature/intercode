import { guarded, makeAppRootContextGuard } from '../routeGuards';

// Root site settings only exist on the root site
export const clientLoader = guarded([makeAppRootContextGuard(({ convention }) => convention?.name == null)]);

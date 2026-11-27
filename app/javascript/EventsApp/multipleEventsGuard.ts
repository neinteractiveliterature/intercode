import { SiteMode } from '../graphqlTypes.generated';
import { guarded, makeAppRootContextGuard } from '../routeGuards';

// A single-event site has no catalog or schedule
export const clientLoader = guarded([
  makeAppRootContextGuard(({ convention }) => convention?.site_mode !== SiteMode.SingleEvent),
]);

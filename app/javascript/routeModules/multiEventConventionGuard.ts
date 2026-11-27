import { SiteMode } from '../graphqlTypes.generated';
import { guarded, makeAppRootContextGuard } from '../routeGuards';

// Pages of a convention with more than one event
export const clientLoader = guarded([
  makeAppRootContextGuard(
    ({ convention }) => convention?.name != null && convention?.site_mode !== SiteMode.SingleEvent,
  ),
]);

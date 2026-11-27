import { SiteMode } from '../../../graphqlTypes.generated';
import { guarded, makeAppRootContextGuard } from '../../../routeGuards';
export const clientLoader = guarded([
  makeAppRootContextGuard(
    ({ convention }) => convention?.name != null && convention?.site_mode !== SiteMode.SingleEvent,
  ),
]);

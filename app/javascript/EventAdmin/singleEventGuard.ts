import { SiteMode } from '../graphqlTypes.generated';
import { guarded, makeAppRootContextGuard } from '../routeGuards';

// A single-event site edits its event directly under /admin_events
export const clientLoader = guarded([
  makeAppRootContextGuard(({ convention }) => convention?.site_mode === SiteMode.SingleEvent),
]);

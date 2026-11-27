import { SignupAutomationMode } from '../graphqlTypes.generated';
import { guarded, makeAppRootContextGuard } from '../routeGuards';

// The ranked choice queues only exist with ranked choice signups
export const clientLoader = guarded([
  makeAppRootContextGuard(({ convention }) => convention?.signup_automation_mode === SignupAutomationMode.RankedChoice),
]);

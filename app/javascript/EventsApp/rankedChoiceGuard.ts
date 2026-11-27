import { SignupAutomationMode } from '../graphqlTypes.generated';
import { guarded, makeAppRootContextGuard } from '../routeGuards';

// The signup queue only exists with ranked choice signups
export const clientLoader = guarded([
  makeAppRootContextGuard(({ convention }) => convention?.signup_automation_mode === SignupAutomationMode.RankedChoice),
]);

import { SignupAutomationMode } from '../../../graphqlTypes.generated';
import { guarded, makeAppRootContextGuard } from '../../../routeGuards';
export const clientLoader = guarded([
  makeAppRootContextGuard(({ convention }) => convention?.signup_automation_mode === SignupAutomationMode.RankedChoice),
]);

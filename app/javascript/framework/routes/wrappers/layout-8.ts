import { SignupMode } from '../../../graphqlTypes.generated';
import { guarded, makeAppRootContextGuard } from '../../../routeGuards';
export const clientLoader = guarded([
  makeAppRootContextGuard(({ convention }) => convention?.signup_mode === SignupMode.Moderated),
]);

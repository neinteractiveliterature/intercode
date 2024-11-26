import { SignupAutomationMode } from 'graphqlTypes.generated';
import AppRootContextRouteGuard from './AppRouteContextRouteGuard';

export default function RankedChoiceRouteGuard() {
  return (
    <AppRootContextRouteGuard
      guard={({ signupAutomationMode }) => signupAutomationMode === SignupAutomationMode.RankedChoice}
    />
  );
}

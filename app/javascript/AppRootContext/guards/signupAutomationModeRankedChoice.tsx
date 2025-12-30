import { useContext } from 'react';
import { Outlet } from 'react-router';
import AppRootContext from '~/AppRootContext';
import FourOhFourPage from '~/FourOhFourPage';
import { SignupAutomationMode } from '~/graphqlTypes.generated';

export function Component() {
  const { signupAutomationMode } = useContext(AppRootContext);

  if (signupAutomationMode === SignupAutomationMode.RankedChoice) {
    return <Outlet />;
  }

  return <FourOhFourPage />;
}

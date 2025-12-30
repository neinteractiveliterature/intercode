import { useContext } from 'react';
import { Outlet } from 'react-router';
import AppRootContext from '~/AppRootContext';
import FourOhFourPage from '~/FourOhFourPage';
import { SignupMode } from '~/graphqlTypes.generated';

export function Component() {
  const { signupMode } = useContext(AppRootContext);

  if (signupMode === SignupMode.Moderated) {
    return <Outlet />;
  }

  return <FourOhFourPage />;
}

import { useContext } from 'react';
import { Outlet } from 'react-router';
import AppRootContext from '~/AppRootContext';
import FourOhFourPage from '~/FourOhFourPage';

export function Component() {
  const { conventionName } = useContext(AppRootContext);

  if (conventionName == null) {
    return <Outlet />;
  }

  return <FourOhFourPage />;
}

import { useContext } from 'react';
import { Outlet } from 'react-router';
import AppRootContext from '~/AppRootContext';
import FourOhFourPage from '~/FourOhFourPage';
import { SiteMode } from '~/graphqlTypes.generated';

export function Component() {
  const { conventionName, siteMode } = useContext(AppRootContext);

  if (conventionName != null && siteMode !== SiteMode.SingleEvent) {
    return <Outlet />;
  }

  return <FourOhFourPage />;
}

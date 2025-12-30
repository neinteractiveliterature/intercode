import { useContext } from 'react';
import { Outlet, useNavigate } from 'react-router';
import AppRootContext from '../../AppRootContext';
import { SiteMode } from '../../graphqlTypes.generated';

export function Component() {
  const { siteMode } = useContext(AppRootContext);
  const navigate = useNavigate();

  if (siteMode === SiteMode.SingleEvent) {
    navigate('/', { replace: true });
    return <></>;
  }

  return <Outlet />;
}

import AppRootContext from 'AppRootContext';
import { SiteMode } from 'graphqlTypes.generated';
import { useContext } from 'react';
import { Outlet, useNavigate } from 'react-router';

export default function EventPageGuard() {
  const { siteMode } = useContext(AppRootContext);
  const navigate = useNavigate();

  if (siteMode === SiteMode.SingleEvent) {
    navigate('/', { replace: true });
    return <></>;
  } else {
    return <Outlet />;
  }
}

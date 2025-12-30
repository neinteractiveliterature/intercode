import { useContext } from 'react';
import { Outlet, useNavigate } from 'react-router';
import AppRootContext from '../../AppRootContext';
import { SiteMode } from '../../graphqlTypes.generated';
import useLoginRequired from '../../Authentication/useLoginRequired';

export function Component() {
  const { siteMode } = useContext(AppRootContext);
  const navigate = useNavigate();
  const loginRequired = useLoginRequired();

  if (siteMode === SiteMode.SingleEvent) {
    navigate('/admin_events', { replace: true });
    return <></>;
  }

  if (loginRequired) {
    return <></>;
  }

  return <Outlet />;
}

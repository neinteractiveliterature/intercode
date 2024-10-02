import AppRootContext from 'AppRootContext';
import { SiteMode } from 'graphqlTypes.generated';
import { useContext } from 'react';
import { useNavigate } from 'react-router';
import LoginRequiredRouteGuard from './LoginRequiredRouteGuard';

export default function EditEventGuard() {
  const { siteMode } = useContext(AppRootContext);
  const navigate = useNavigate();

  if (siteMode === SiteMode.SingleEvent) {
    navigate('/admin_events', { replace: true });
    return <></>;
  } else {
    return <LoginRequiredRouteGuard />;
  }
}

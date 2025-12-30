import { Outlet } from 'react-router';
import useAuthorizationRequired from '../useAuthorizationRequired';

export function Component() {
  const authorizationWarning = useAuthorizationRequired('can_update_notification_templates');

  if (authorizationWarning) return authorizationWarning;

  return <Outlet />;
}

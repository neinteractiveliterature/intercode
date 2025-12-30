import { Outlet } from 'react-router';
import useAuthorizationRequired from '../useAuthorizationRequired';

export function Component() {
  const authorizationWarning = useAuthorizationRequired('can_read_reports');

  if (authorizationWarning) return authorizationWarning;

  return <Outlet />;
}

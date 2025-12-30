import { Outlet } from 'react-router';
import useAuthorizationRequired from '../useAuthorizationRequired';

export function Component() {
  const authorizationWarning = useAuthorizationRequired('can_read_user_con_profiles');

  if (authorizationWarning) return authorizationWarning;

  return <Outlet />;
}

import { Outlet } from 'react-router';
import useAuthorizationRequired from '../useAuthorizationRequired';

export function Component() {
  const authorizationWarning = useAuthorizationRequired('can_read_any_mailing_list');

  if (authorizationWarning) return authorizationWarning;

  return <Outlet />;
}

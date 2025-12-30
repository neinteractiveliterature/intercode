import { Outlet } from 'react-router';
import useAuthorizationRequired from '../useAuthorizationRequired';

export function Component() {
  const authorizationWarning = useAuthorizationRequired('can_manage_ticket_types');

  if (authorizationWarning) return authorizationWarning;

  return <Outlet />;
}

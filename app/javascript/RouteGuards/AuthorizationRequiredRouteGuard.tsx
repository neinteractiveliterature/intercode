import useAuthorizationRequired, { AbilityName } from 'Authentication/useAuthorizationRequired';
import { Outlet } from 'react-router';

export type AuthorizationRequiredRouteGuardProps = {
  abilities: AbilityName[];
};

export default function AuthorizationRequiredRouteGuard({ abilities }: AuthorizationRequiredRouteGuardProps) {
  const authorizationWarning = useAuthorizationRequired(...abilities);

  if (authorizationWarning) return authorizationWarning;

  return <Outlet />;
}

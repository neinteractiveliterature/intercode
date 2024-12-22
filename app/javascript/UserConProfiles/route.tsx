import AuthorizationRequiredRouteGuard from 'RouteGuards/AuthorizationRequiredRouteGuard';

export default function UserConProfilesRoute() {
  return <AuthorizationRequiredRouteGuard abilities={['can_read_user_con_profiles']} />;
}

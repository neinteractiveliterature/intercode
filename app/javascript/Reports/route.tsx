import AuthorizationRequiredRouteGuard from 'RouteGuards/AuthorizationRequiredRouteGuard';

export default function ReportsRoute() {
  return <AuthorizationRequiredRouteGuard abilities={['can_read_reports']} />;
}

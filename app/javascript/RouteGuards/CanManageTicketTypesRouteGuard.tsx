import AuthorizationRequiredRouteGuard from './AuthorizationRequiredRouteGuard';

export default function CanManageTicketTypesRouteGuard() {
  return <AuthorizationRequiredRouteGuard abilities={['can_manage_ticket_types']} />;
}

import AuthorizationRequiredRouteGuard from './AuthorizationRequiredRouteGuard';

export default function CanUpdateNotificationTemplatesRouteGuard() {
  return <AuthorizationRequiredRouteGuard abilities={['can_update_notification_templates']} />;
}

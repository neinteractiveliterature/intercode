import AuthorizationRequiredRouteGuard from 'RouteGuards/AuthorizationRequiredRouteGuard';

export default function MailingListsRoute() {
  return <AuthorizationRequiredRouteGuard abilities={['can_read_any_mailing_list']} />;
}

import AppRootContextRouteGuard from './AppRouteContextRouteGuard';

export default function ConventionRouteGuard() {
  return <AppRootContextRouteGuard guard={({ conventionName }) => conventionName != null} />;
}

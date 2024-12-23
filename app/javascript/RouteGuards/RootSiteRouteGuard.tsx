import AppRootContextRouteGuard from './AppRouteContextRouteGuard';

export default function RootSiteRouteGuard() {
  return <AppRootContextRouteGuard guard={({ conventionName }) => conventionName == null} />;
}

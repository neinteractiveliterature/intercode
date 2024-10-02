import { SiteMode } from 'graphqlTypes.generated';
import AppRootContextRouteGuard from './AppRouteContextRouteGuard';

export default function MultiEventConventionRouteGuard() {
  return (
    <AppRootContextRouteGuard
      guard={({ conventionName, siteMode }) => conventionName != null && siteMode !== SiteMode.SingleEvent}
    />
  );
}

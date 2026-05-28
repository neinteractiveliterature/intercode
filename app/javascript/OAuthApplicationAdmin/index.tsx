import { Outlet } from 'react-router';

import RouteActivatedBreadcrumbItem from '../Breadcrumbs/RouteActivatedBreadcrumbItem';
import LeafBreadcrumbItem from '../Breadcrumbs/LeafBreadcrumbItem';
import NamedRouteBreadcrumbItem from '../Breadcrumbs/NamedRouteBreadcrumbItem';
import useAuthorizationRequired from '../Authentication/useAuthorizationRequired';
import { NamedRoute } from '../AppRouter';

function OAuthApplicationAdmin(): React.JSX.Element {
  const authorizationWarning = useAuthorizationRequired('can_manage_oauth_applications');
  if (authorizationWarning) return authorizationWarning;

  return (
    <>
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <RouteActivatedBreadcrumbItem to="" end>
            OAuth2 applications
          </RouteActivatedBreadcrumbItem>

          <LeafBreadcrumbItem path="new">New application</LeafBreadcrumbItem>

          <NamedRouteBreadcrumbItem routeId={NamedRoute.EditOAuthApplication}>
            Edit application
          </NamedRouteBreadcrumbItem>
        </ol>
      </nav>

      <Outlet />
    </>
  );
}

export const Component = OAuthApplicationAdmin;

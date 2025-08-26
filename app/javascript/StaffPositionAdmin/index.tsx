import { Outlet } from 'react-router';

import RouteActivatedBreadcrumbItem from '../Breadcrumbs/RouteActivatedBreadcrumbItem';
import useAuthorizationRequired from '../Authentication/useAuthorizationRequired';
import LeafBreadcrumbItem from '../Breadcrumbs/LeafBreadcrumbItem';
import NamedRouteBreadcrumbItem from '../Breadcrumbs/NamedRouteBreadcrumbItem';
import { NamedRoute } from '../AppRouter';

function StaffPositionAdmin(): React.JSX.Element {
  const authorizationWarning = useAuthorizationRequired('can_manage_staff_positions');
  if (authorizationWarning) return authorizationWarning;

  return (
    <>
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <RouteActivatedBreadcrumbItem to="" end>
            Staff positions
          </RouteActivatedBreadcrumbItem>

          <LeafBreadcrumbItem path="new">New staff position</LeafBreadcrumbItem>

          <NamedRouteBreadcrumbItem routeId={NamedRoute.EditStaffPosition}>Edit settings</NamedRouteBreadcrumbItem>
          <NamedRouteBreadcrumbItem routeId={NamedRoute.EditStaffPositionPermissions}>
            Edit permissions
          </NamedRouteBreadcrumbItem>
        </ol>
      </nav>

      <Outlet />
    </>
  );
}

export const Component = StaffPositionAdmin;

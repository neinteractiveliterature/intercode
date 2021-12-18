import { Outlet } from 'react-router-dom';

import RouteActivatedBreadcrumbItem from '../Breadcrumbs/RouteActivatedBreadcrumbItem';
import useAuthorizationRequired from '../Authentication/useAuthorizationRequired';
import LeafBreadcrumbItem from '../Breadcrumbs/LeafBreadcrumbItem';

function EventCategoryAdmin(): JSX.Element {
  const authorizationWarning = useAuthorizationRequired('can_update_event_categories');

  if (authorizationWarning) return authorizationWarning;

  return (
    <>
      <ol className="breadcrumb">
        <RouteActivatedBreadcrumbItem pattern={{ path: '/event_categories', end: true }} to="/event_categories">
          Event categories
        </RouteActivatedBreadcrumbItem>

        <LeafBreadcrumbItem path="/event_categories/new">New event category</LeafBreadcrumbItem>

        <RouteActivatedBreadcrumbItem pattern="/event_categories/:id/edit" to="." hideUnlessMatch>
          Edit event category
        </RouteActivatedBreadcrumbItem>
      </ol>

      <Outlet />
    </>
  );
}

export default EventCategoryAdmin;

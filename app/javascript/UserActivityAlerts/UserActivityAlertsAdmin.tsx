import { Routes, Route } from 'react-router-dom';

import EditUserActivityAlert from './EditUserActivityAlert';
import NewUserActivityAlert from './NewUserActivityAlert';
import UserActivityAlertsList from './UserActivityAlertsList';
import RouteActivatedBreadcrumbItem from '../Breadcrumbs/RouteActivatedBreadcrumbItem';
import useAuthorizationRequired from '../Authentication/useAuthorizationRequired';
import LeafBreadcrumbItem from '../Breadcrumbs/LeafBreadcrumbItem';

function UserActivityAlertsAdmin(): JSX.Element {
  const authorizationWarning = useAuthorizationRequired('can_read_user_activity_alerts');
  if (authorizationWarning) return authorizationWarning;

  return (
    <>
      <nav aria-label="breadcrumb" className="mb-4">
        <ol className="breadcrumb">
          <RouteActivatedBreadcrumbItem
            pattern={{ path: '/user_activity_alerts', end: true }}
            to="/user_activity_alerts"
          >
            User activity alerts
          </RouteActivatedBreadcrumbItem>

          <LeafBreadcrumbItem path="/user_activity_alerts/new">Create</LeafBreadcrumbItem>
          <LeafBreadcrumbItem path="/user_activity_alerts/:id/edit">Edit</LeafBreadcrumbItem>
        </ol>
      </nav>

      <Routes>
        <Route path="new" element={<NewUserActivityAlert />} />
        <Route path=":id/edit" element={<EditUserActivityAlert />} />
        <Route path="" element={<UserActivityAlertsList />} />
      </Routes>
    </>
  );
}

export default UserActivityAlertsAdmin;

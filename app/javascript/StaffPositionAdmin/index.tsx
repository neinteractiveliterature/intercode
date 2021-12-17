import { Route, Routes } from 'react-router-dom';

import EditStaffPosition from './EditStaffPosition';
import EditStaffPositionPermissions from './EditStaffPositionPermissions';
import NewStaffPosition from './NewStaffPosition';
import StaffPositionsTable from './StaffPositionsTable';
import BreadcrumbItem from '../Breadcrumbs/BreadcrumbItem';
import RouteActivatedBreadcrumbItem from '../Breadcrumbs/RouteActivatedBreadcrumbItem';
import useAuthorizationRequired from '../Authentication/useAuthorizationRequired';

function StaffPositionAdmin(): JSX.Element {
  const authorizationWarning = useAuthorizationRequired('can_manage_staff_positions');
  if (authorizationWarning) return authorizationWarning;

  return (
    <>
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <RouteActivatedBreadcrumbItem pattern={{ path: '/staff_positions', end: true }} to="/staff_positions">
            Staff positions
          </RouteActivatedBreadcrumbItem>

          <Route path="/staff_positions/new">
            <BreadcrumbItem active>New staff position</BreadcrumbItem>
          </Route>

          <Route path="/staff_positions/:id/edit">
            <BreadcrumbItem active>Edit settings</BreadcrumbItem>
          </Route>

          <Route path="/staff_positions/:id/edit_permissions">
            <BreadcrumbItem active>Edit permissions</BreadcrumbItem>
          </Route>
        </ol>
      </nav>

      <Routes>
        <Route path="/staff_positions/new">
          <NewStaffPosition />
        </Route>
        <Route path="/staff_positions/:id/edit">
          <EditStaffPosition />
        </Route>
        <Route path="/staff_positions/:id/edit_permissions">
          <EditStaffPositionPermissions />
        </Route>
        <Route path="/staff_positions">
          <StaffPositionsTable />
        </Route>
      </Routes>
    </>
  );
}

export default StaffPositionAdmin;

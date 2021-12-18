import { Route, Routes } from 'react-router-dom';

import EditStaffPosition from './EditStaffPosition';
import EditStaffPositionPermissions from './EditStaffPositionPermissions';
import NewStaffPosition from './NewStaffPosition';
import StaffPositionsTable from './StaffPositionsTable';
import RouteActivatedBreadcrumbItem from '../Breadcrumbs/RouteActivatedBreadcrumbItem';
import useAuthorizationRequired from '../Authentication/useAuthorizationRequired';
import LeafBreadcrumbItem from '../Breadcrumbs/LeafBreadcrumbItem';

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

          <LeafBreadcrumbItem path="/staff_positions/new">New staff position</LeafBreadcrumbItem>
          <LeafBreadcrumbItem path="/staff_positions/:id/edit">Edit settings</LeafBreadcrumbItem>
          <LeafBreadcrumbItem path="/staff_positions/:id/edit_permissions">Edit permissions</LeafBreadcrumbItem>
        </ol>
      </nav>

      <Routes>
        <Route path="new" element={<NewStaffPosition />} />
        <Route path=":id/edit" element={<EditStaffPosition />} />
        <Route path=":id/edit_permissions" element={<EditStaffPositionPermissions />} />
        <Route path="" element={<StaffPositionsTable />} />
      </Routes>
    </>
  );
}

export default StaffPositionAdmin;

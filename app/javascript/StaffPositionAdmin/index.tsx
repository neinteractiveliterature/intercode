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
          <RouteActivatedBreadcrumbItem to="" end>
            Staff positions
          </RouteActivatedBreadcrumbItem>

          <LeafBreadcrumbItem path="new">New staff position</LeafBreadcrumbItem>

          <Routes>
            <Route
              path=":id/*"
              element={
                <>
                  <LeafBreadcrumbItem path="edit">Edit settings</LeafBreadcrumbItem>
                  <LeafBreadcrumbItem path="edit_permissions">Edit permissions</LeafBreadcrumbItem>
                </>
              }
            />
          </Routes>
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

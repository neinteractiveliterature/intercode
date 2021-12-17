import { Routes, Route } from 'react-router-dom';

import DepartmentAdminIndex from './DepartmentAdminIndex';
import EditDepartment from './EditDepartment';
import NewDepartment from './NewDepartment';
import useAuthorizationRequired from '../Authentication/useAuthorizationRequired';

function DepartmentAdmin(): JSX.Element {
  const authorizationWarning = useAuthorizationRequired('can_update_departments');

  if (authorizationWarning) return authorizationWarning;

  return (
    <Routes>
      <Route path="/admin_departments/:id/edit">
        <EditDepartment />
      </Route>
      <Route path="/admin_departments/new">
        <NewDepartment />
      </Route>
      <Route path="/admin_departments">
        <DepartmentAdminIndex />
      </Route>
    </Routes>
  );
}

export default DepartmentAdmin;

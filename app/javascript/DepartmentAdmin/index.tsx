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
      <Route path="/admin_departments/:id/edit" element={<EditDepartment />} />
      <Route path="/admin_departments/new" element={<NewDepartment />} />
      <Route path="/admin_departments" element={<DepartmentAdminIndex />} />
    </Routes>
  );
}

export default DepartmentAdmin;

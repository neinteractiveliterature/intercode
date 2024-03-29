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
      <Route path=":id/edit" element={<EditDepartment />} />
      <Route path="new" element={<NewDepartment />} />
      <Route path="" element={<DepartmentAdminIndex />} />
    </Routes>
  );
}

export default DepartmentAdmin;

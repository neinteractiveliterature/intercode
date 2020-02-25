import React from 'react';
import { Switch, Route } from 'react-router-dom';

import DepartmentAdminIndex from './DepartmentAdminIndex';
import EditDepartment from './EditDepartment';
import NewDepartment from './NewDepartment';

function DepartmentAdmin() {
  return (
    <Switch>
      <Route path="/admin_departments/:id/edit"><EditDepartment /></Route>
      <Route path="/admin_departments/new"><NewDepartment /></Route>
      <Route path="/admin_departments"><DepartmentAdminIndex /></Route>
    </Switch>
  );
}

export default DepartmentAdmin;

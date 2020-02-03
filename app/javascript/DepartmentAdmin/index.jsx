import React from 'react';
import { Switch, Route } from 'react-router-dom';

import DepartmentAdminIndex from './DepartmentAdminIndex';
import EditDepartment from './EditDepartment';
import NewDepartment from './NewDepartment';

function DepartmentAdmin() {
  return (
    <Switch>
      <Route path="/admin_departments/:id/edit" component={EditDepartment} />
      <Route path="/admin_departments/new" component={NewDepartment} />
      <Route path="/admin_departments" component={DepartmentAdminIndex} />
    </Switch>
  );
}

export default DepartmentAdmin;

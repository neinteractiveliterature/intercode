import React from 'react';
import { Switch, Route } from 'react-router-dom';

import FormAdminIndex from './FormAdminIndex';
import FormJSONEditor from './FormJSONEditor';
import BreadcrumbItem from '../Breadcrumbs/BreadcrumbItem';
import RouteActivatedBreadcrumbItem from '../Breadcrumbs/RouteActivatedBreadcrumbItem';
import useAuthorizationRequired from '../Authentication/useAuthorizationRequired';

function FormAdmin() {
  const authorizationWarning = useAuthorizationRequired('can_manage_forms');
  if (authorizationWarning) return authorizationWarning;

  return (
    <>
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <RouteActivatedBreadcrumbItem
            matchProps={{ path: '/admin_forms', exact: true }}
            to="/admin_forms"
          >
            Forms
          </RouteActivatedBreadcrumbItem>

          <Route path="/admin_forms/:id/edit_advanced">
            <BreadcrumbItem active>Edit form (advanced)</BreadcrumbItem>
          </Route>
        </ol>
      </nav>

      <Switch>
        <Route path="/admin_forms/:id/edit_advanced"><FormJSONEditor /></Route>
        <Route path="/admin_forms"><FormAdminIndex /></Route>
      </Switch>
    </>
  );
}

export default FormAdmin;

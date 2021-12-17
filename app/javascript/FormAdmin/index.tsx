import { Routes, Route } from 'react-router-dom';

import FormAdminIndex from './FormAdminIndex';
import FormJSONEditor from './FormJSONEditor';
import BreadcrumbItem from '../Breadcrumbs/BreadcrumbItem';
import RouteActivatedBreadcrumbItem from '../Breadcrumbs/RouteActivatedBreadcrumbItem';
import useAuthorizationRequired from '../Authentication/useAuthorizationRequired';

function FormAdmin(): JSX.Element {
  const authorizationWarning = useAuthorizationRequired('can_manage_forms');
  if (authorizationWarning) return authorizationWarning;

  return (
    <>
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <RouteActivatedBreadcrumbItem pattern={{ path: '/admin_forms', end: true }} to="/admin_forms">
            Forms
          </RouteActivatedBreadcrumbItem>

          <Route path="/admin_forms/:id/edit_advanced">
            <BreadcrumbItem active>Edit form (advanced)</BreadcrumbItem>
          </Route>
        </ol>
      </nav>

      <Routes>
        <Route path="/admin_forms/:id/edit_advanced" element={<FormJSONEditor />} />
        <Route path="/admin_forms" element={<FormAdminIndex />} />
      </Routes>
    </>
  );
}

export default FormAdmin;

import { Routes, Route } from 'react-router-dom';

import FormAdminIndex from './FormAdminIndex';
import FormJSONEditor from './FormJSONEditor';
import RouteActivatedBreadcrumbItem from '../Breadcrumbs/RouteActivatedBreadcrumbItem';
import useAuthorizationRequired from '../Authentication/useAuthorizationRequired';
import LeafBreadcrumbItem from '../Breadcrumbs/LeafBreadcrumbItem';

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

          <LeafBreadcrumbItem path="/admin_forms/:id/edit_advanced">Edit form (advanced)</LeafBreadcrumbItem>
        </ol>
      </nav>

      <Routes>
        <Route path=":id/edit_advanced" element={<FormJSONEditor />} />
        <Route path="" element={<FormAdminIndex />} />
      </Routes>
    </>
  );
}

export default FormAdmin;

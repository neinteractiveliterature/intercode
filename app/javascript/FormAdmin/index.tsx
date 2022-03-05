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
          <RouteActivatedBreadcrumbItem to="/admin_forms" end>
            Forms
          </RouteActivatedBreadcrumbItem>

          <Routes>
            <Route
              path=":id/edit_advanced"
              element={<LeafBreadcrumbItem path="">Edit form (advanced)</LeafBreadcrumbItem>}
            />
          </Routes>
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

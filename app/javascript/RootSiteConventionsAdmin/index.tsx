import { Outlet, Route, Routes } from 'react-router-dom';
import { LoadingIndicator } from '@neinteractiveliterature/litform';

import RouteActivatedBreadcrumbItem from '../Breadcrumbs/RouteActivatedBreadcrumbItem';
import { useConventionQueryFromIdParam } from './conventionQueryHooks';
import BreadcrumbItem from '../Breadcrumbs/BreadcrumbItem';
import useAuthorizationRequired from '../Authentication/useAuthorizationRequired';

function ConventionBreadcrumb() {
  const { data, loading, error } = useConventionQueryFromIdParam();

  if (loading) {
    return <LoadingIndicator iconSet="bootstrap-icons" />;
  }
  if (error || !data) {
    return <>Convention</>;
  }

  return <BreadcrumbItem active>{data.convention.name}</BreadcrumbItem>;
}

function RootSiteConventionsAdmin(): JSX.Element {
  const authorizationWarning = useAuthorizationRequired('can_manage_conventions');
  if (authorizationWarning) return authorizationWarning;

  return (
    <>
      <ol className="breadcrumb">
        <RouteActivatedBreadcrumbItem to=".?sort.starts_at=desc" end>
          Conventions
        </RouteActivatedBreadcrumbItem>

        <Routes>
          <Route path=":id" element={<ConventionBreadcrumb />} />
        </Routes>
      </ol>

      <Outlet />
    </>
  );
}

export default RootSiteConventionsAdmin;

import { Routes, Route } from 'react-router-dom';
import { LoadingIndicator } from '@neinteractiveliterature/litform';

import RootSiteConventionsAdminTable from './RootSiteConventionsAdminTable';
import RouteActivatedBreadcrumbItem from '../Breadcrumbs/RouteActivatedBreadcrumbItem';
import ConventionDisplay from './ConventionDisplay';
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
        <RouteActivatedBreadcrumbItem
          to="/conventions?sort.starts_at=desc"
          pattern={{ path: '/conventions', end: true }}
        >
          Conventions
        </RouteActivatedBreadcrumbItem>

        <Route path="/conventions/:id">
          <ConventionBreadcrumb />
        </Route>
      </ol>

      <Routes>
        <Route path="/conventions/:id" element={<ConventionDisplay />} />
        <Route path="/conventions" element={<RootSiteConventionsAdminTable />} />
      </Routes>
    </>
  );
}

export default RootSiteConventionsAdmin;

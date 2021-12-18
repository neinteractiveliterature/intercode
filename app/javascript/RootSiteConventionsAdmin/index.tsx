import { useMatch, Outlet } from 'react-router-dom';
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
  const conventionMatch = useMatch('/conventions/:id');
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

        {conventionMatch && <ConventionBreadcrumb />}
      </ol>

      <Outlet />
    </>
  );
}

export default RootSiteConventionsAdmin;

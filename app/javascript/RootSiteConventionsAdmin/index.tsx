import { Outlet, useRouteLoaderData } from 'react-router';

import useAuthorizationRequired from '../Authentication/useAuthorizationRequired';
import NamedRouteBreadcrumbItem from '../Breadcrumbs/NamedRouteBreadcrumbItem';
import { NamedRoute } from '../NamedRoute';
import type { clientLoader } from './ConventionDisplay';

function RootSiteConventionsAdmin(): React.JSX.Element {
  const conventionData = useRouteLoaderData<typeof clientLoader>(NamedRoute.RootSiteConventionDisplay);
  const authorizationWarning = useAuthorizationRequired('can_manage_conventions');
  if (authorizationWarning) return authorizationWarning;

  return (
    <>
      <ol className="breadcrumb">
        <NamedRouteBreadcrumbItem routeId={['RootSiteConventionsAdmin', 'RootSiteConventionsAdminTable']}>
          Conventions
        </NamedRouteBreadcrumbItem>

        <NamedRouteBreadcrumbItem routeId={NamedRoute.RootSiteConventionDisplay}>
          {conventionData?.convention.name}
        </NamedRouteBreadcrumbItem>
      </ol>

      <Outlet />
    </>
  );
}

export default RootSiteConventionsAdmin;

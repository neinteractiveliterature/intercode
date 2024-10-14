import { Outlet, useRouteLoaderData } from 'react-router';

import useAuthorizationRequired from '../Authentication/useAuthorizationRequired';
import NamedRouteBreadcrumbItem from '../Breadcrumbs/NamedRouteBreadcrumbItem';
import { NamedRoute } from '../appRoutes';
import { ConventionDisplayQueryData } from './queries.generated';

function RootSiteConventionsAdmin(): JSX.Element {
  const conventionData = useRouteLoaderData(NamedRoute.RootSiteConventionDisplay) as
    | ConventionDisplayQueryData
    | undefined;
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

export const Component = RootSiteConventionsAdmin;

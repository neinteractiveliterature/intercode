import { Outlet, useRouteLoaderData } from 'react-router-dom';

import RouteActivatedBreadcrumbItem from '../Breadcrumbs/RouteActivatedBreadcrumbItem';
import useAuthorizationRequired from '../Authentication/useAuthorizationRequired';
import NamedRouteBreadcrumbItem from '../Breadcrumbs/NamedRouteBreadcrumbItem';
import { NamedRoute } from '../AppRouter';
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
        <RouteActivatedBreadcrumbItem to=".?sort.starts_at=desc" end>
          Conventions
        </RouteActivatedBreadcrumbItem>

        <NamedRouteBreadcrumbItem hideUnlessMatch routeId={NamedRoute.RootSiteConventionDisplay}>
          {conventionData?.convention.name}
        </NamedRouteBreadcrumbItem>
      </ol>

      <Outlet />
    </>
  );
}

export const Component = RootSiteConventionsAdmin;

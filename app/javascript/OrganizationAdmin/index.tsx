import { Outlet, useRouteLoaderData } from 'react-router-dom';

import RouteActivatedBreadcrumbItem from '../Breadcrumbs/RouteActivatedBreadcrumbItem';
import useAuthorizationRequired from '../Authentication/useAuthorizationRequired';
import { NamedRoute } from '../AppRouter';
import { SingleOrganizationLoaderResult } from './loaders';
import NamedRouteBreadcrumbItem from '../Breadcrumbs/NamedRouteBreadcrumbItem';

function OrganizationAdmin(): JSX.Element {
  const organization = useRouteLoaderData(NamedRoute.Organization) as SingleOrganizationLoaderResult | undefined;
  const authorizationWarning = useAuthorizationRequired('can_read_organizations');
  if (authorizationWarning) return authorizationWarning;

  return (
    <>
      <ol className="breadcrumb">
        <RouteActivatedBreadcrumbItem to="" end>
          Organizations
        </RouteActivatedBreadcrumbItem>

        {organization && (
          <>
            <NamedRouteBreadcrumbItem routeId={[NamedRoute.Organization, NamedRoute.OrganizationDisplay]}>
              {organization.name}
            </NamedRouteBreadcrumbItem>

            <RouteActivatedBreadcrumbItem to="roles/new" hideUnlessMatch>
              New organization role
            </RouteActivatedBreadcrumbItem>

            <NamedRouteBreadcrumbItem routeId={NamedRoute.EditOrganizationRole} hideUnlessMatch>
              Edit organization role
            </NamedRouteBreadcrumbItem>
          </>
        )}
      </ol>

      <Outlet />
    </>
  );
}

export const Component = OrganizationAdmin;

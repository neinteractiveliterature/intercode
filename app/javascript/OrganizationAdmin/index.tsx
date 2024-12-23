import { Outlet } from 'react-router';

import RouteActivatedBreadcrumbItem from '../Breadcrumbs/RouteActivatedBreadcrumbItem';
import useAuthorizationRequired from '../Authentication/useAuthorizationRequired';
import NamedRouteBreadcrumbItem from '../Breadcrumbs/NamedRouteBreadcrumbItem';
import { useOrganizationLoaderData } from './$id';

function OrganizationAdmin(): JSX.Element {
  const organization = useOrganizationLoaderData();
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
            <NamedRouteBreadcrumbItem routeId={['Organization', 'OrganizationDisplay']}>
              {organization.organization.name}
            </NamedRouteBreadcrumbItem>

            <NamedRouteBreadcrumbItem routeId="NewOrganizationRole">New organization role</NamedRouteBreadcrumbItem>
            <NamedRouteBreadcrumbItem routeId="EditOrganizationRole">Edit organization role</NamedRouteBreadcrumbItem>
          </>
        )}
      </ol>

      <Outlet />
    </>
  );
}

export default OrganizationAdmin;

import { useParams, useMatch, Outlet } from 'react-router-dom';
import { LoadingIndicator, ErrorDisplay } from '@neinteractiveliterature/litform';

import BreadcrumbItem from '../Breadcrumbs/BreadcrumbItem';
import RouteActivatedBreadcrumbItem from '../Breadcrumbs/RouteActivatedBreadcrumbItem';
import useAuthorizationRequired from '../Authentication/useAuthorizationRequired';
import { useOrganizationAdminOrganizationsQuery } from './queries.generated';

function OrganizationWithIdBreadcrumbs() {
  const { id } = useParams<{ id: string }>();
  const { data, loading, error } = useOrganizationAdminOrganizationsQuery();
  const organizationMainPageMatch = useMatch({ path: `/organizations/${id}`, end: true });

  if (loading) {
    return (
      <BreadcrumbItem active>
        <LoadingIndicator iconSet="bootstrap-icons" />
      </BreadcrumbItem>
    );
  }

  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

  const organization = data?.organizations.find((org) => org.id.toString() === id);

  return (
    <>
      <BreadcrumbItem to={`/organizations/${id}`} active={organizationMainPageMatch != null}>
        {organization?.name ?? 'Organization'}
      </BreadcrumbItem>

      <RouteActivatedBreadcrumbItem pattern="/organizations/:id/roles/new" to="." hideUnlessMatch>
        New organization role
      </RouteActivatedBreadcrumbItem>

      <RouteActivatedBreadcrumbItem pattern="/organizations/:id/roles/:roleId/edit" to="." hideUnlessMatch>
        Edit organization role
      </RouteActivatedBreadcrumbItem>
    </>
  );
}

function OrganizationAdmin(): JSX.Element {
  const authorizationWarning = useAuthorizationRequired('can_read_organizations');
  const specificOrganizationMatch = useMatch('/organizations/:id');
  if (authorizationWarning) return authorizationWarning;

  return (
    <>
      <ol className="breadcrumb">
        <RouteActivatedBreadcrumbItem pattern={{ path: '/organizations', end: true }} to="/organizations">
          Organizations
        </RouteActivatedBreadcrumbItem>

        {specificOrganizationMatch && <OrganizationWithIdBreadcrumbs />}
      </ol>

      <Outlet />
    </>
  );
}

export default OrganizationAdmin;

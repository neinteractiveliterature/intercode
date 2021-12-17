import { Routes, Route, useParams, useMatch } from 'react-router-dom';
import { LoadingIndicator, ErrorDisplay } from '@neinteractiveliterature/litform';

import EditOrganizationRole from './EditOrganizationRole';
import NewOrganizationRole from './NewOrganizationRole';
import OrganizationDisplay from './OrganizationDisplay';
import OrganizationIndex from './OrganizationIndex';
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

      <Route path="/organizations/:id/roles/new">
        <BreadcrumbItem active>New organization role</BreadcrumbItem>
      </Route>

      <Route path="/organizations/:id/roles/:roleId/edit">
        <BreadcrumbItem active>Edit organization role</BreadcrumbItem>
      </Route>
    </>
  );
}

function OrganizationAdmin(): JSX.Element {
  const authorizationWarning = useAuthorizationRequired('can_read_organizations');
  if (authorizationWarning) return authorizationWarning;

  return (
    <>
      <ol className="breadcrumb">
        <RouteActivatedBreadcrumbItem pattern={{ path: '/organizations', end: true }} to="/organizations">
          Organizations
        </RouteActivatedBreadcrumbItem>

        <Route path="/organizations/:id">
          <OrganizationWithIdBreadcrumbs />
        </Route>
      </ol>

      <Routes>
        <Route path="/organizations/:id/roles/new">
          <NewOrganizationRole />
        </Route>
        <Route path="/organizations/:organizationId/roles/:organizationRoleId/edit">
          <EditOrganizationRole />
        </Route>
        <Route path="/organizations/:id">
          <OrganizationDisplay />
        </Route>
        <Route path="/organizations">
          <OrganizationIndex />
        </Route>
      </Routes>
    </>
  );
}

export default OrganizationAdmin;

import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { useQuery } from 'react-apollo-hooks';

import BreadcrumbItemWithRoute from '../Breadcrumbs/BreadcrumbItemWithRoute';
import EditOrganizationRole from './EditOrganizationRole';
import NewOrganizationRole from './NewOrganizationRole';
import { OrganizationAdminOrganizationsQuery } from './queries.gql';
import OrganizationDisplay from './OrganizationDisplay';
import OrganizationIndex from './OrganizationIndex';
import ErrorDisplay from '../ErrorDisplay';
import PageLoadingIndicator from '../PageLoadingIndicator';

function OrganizationAdmin() {
  const { data, loading, error } = useQuery(OrganizationAdminOrganizationsQuery);

  if (loading) {
    return <PageLoadingIndicator visible />;
  }

  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

  return (
    <>
      <ol className="breadcrumb">
        <BreadcrumbItemWithRoute
          to="/organizations"
          path="/organizations"
          exact
        >
          Organizations
        </BreadcrumbItemWithRoute>

        <Route
          path="/organizations/:id"
          render={({ match: { params: { id } } }) => {
            const organization = data.organizations.find((org) => org.id.toString() === id);

            return (
              <>
                <BreadcrumbItemWithRoute
                  path="/organizations/:id"
                  to={({ match: { params } }) => `/organizations/${params.id}`}
                  active={({ match }) => match.isExact}
                >
                  {organization.name}
                </BreadcrumbItemWithRoute>

                <BreadcrumbItemWithRoute
                  path="/organizations/:id/roles/new"
                  to={({ match: { params } }) => `/organizations/${params.id}/roles/new`}
                  hideUnlessMatch
                >
                  New organization role
                </BreadcrumbItemWithRoute>

                <BreadcrumbItemWithRoute
                  path="/organizations/:id/roles/:roleId/edit"
                  to={({ match: { params } }) => `/organizations/${params.id}/roles/${params.roleId}/edit`}
                  hideUnlessMatch
                >
                  Edit organization role
                </BreadcrumbItemWithRoute>
              </>
            );
          }}
        />
      </ol>

      <Switch>
        <Route
          path="/organizations/:organizationId/roles/new"
          render={({ match: { params: { organizationId } } }) => (
            <NewOrganizationRole organizationId={Number.parseInt(organizationId, 10)} />
          )}
        />
        <Route
          path="/organizations/:organizationId/roles/:organizationRoleId/edit"
          render={({ match: { params: { organizationId, organizationRoleId } } }) => (
            <EditOrganizationRole
              organizationId={Number.parseInt(organizationId, 10)}
              organizationRoleId={Number.parseInt(organizationRoleId, 10)}
            />
          )}
        />
        <Route
          path="/organizations/:id"
          render={({ match: { params: { id } } }) => (
            <OrganizationDisplay organizationId={Number.parseInt(id, 10)} />
          )}
        />
        <Route path="/organizations" render={() => <OrganizationIndex />} />
      </Switch>
    </>
  );
}

export default OrganizationAdmin;

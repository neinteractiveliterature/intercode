import React from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { useQuery } from 'react-apollo-hooks';

import BreadcrumbItemWithRoute from '../Breadcrumbs/BreadcrumbItemWithRoute';
import EditOrganizationRole from './EditOrganizationRole';
import NewOrganizationRole from './NewOrganizationRole';
import { OrganizationAdminOrganizationsQuery } from './queries.gql';
import OrganizationDisplay from './OrganizationDisplay';
import OrganizationIndex from './OrganizationIndex';
import ErrorDisplay from '../ErrorDisplay';

function OrganizationAdmin({ basename }) {
  const { data, error } = useQuery(OrganizationAdminOrganizationsQuery);

  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

  return (
    <BrowserRouter basename={basename}>
      <>
        <ol className="breadcrumb">
          <BreadcrumbItemWithRoute
            to="/"
            path="/"
            exact
            pageTitleIfActive="Organizations"
          >
            Organizations
          </BreadcrumbItemWithRoute>

          <Route
            path="/:id"
            render={({ match: { params: { id } } }) => {
              const organization = data.organizations.find(org => org.id.toString() === id);

              return (
                <>
                  <BreadcrumbItemWithRoute
                    path="/:id"
                    to={({ match: { params } }) => `/${params.id}`}
                    active={({ match }) => match.isExact}
                    pageTitleIfActive={organization.name}
                  >
                    {organization.name}
                  </BreadcrumbItemWithRoute>

                  <BreadcrumbItemWithRoute
                    path="/:id/roles/new"
                    to={({ match: { params } }) => `/${params.id}/roles/new`}
                    hideUnlessMatch
                    pageTitleIfActive="New organization role"
                  >
                    New organization role
                  </BreadcrumbItemWithRoute>

                  <BreadcrumbItemWithRoute
                    path="/:id/roles/:roleId/edit"
                    to={({ match: { params } }) => `/${params.id}/roles/${params.roleId}/edit`}
                    hideUnlessMatch
                    pageTitleIfActive="Edit organization role"
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
            path="/:organizationId/roles/new"
            render={({ match: { params: { organizationId } } }) => (
              <NewOrganizationRole organizationId={Number.parseInt(organizationId, 10)} />
            )}
          />
          <Route
            path="/:organizationId/roles/:organizationRoleId/edit"
            render={({ match: { params: { organizationId, organizationRoleId } } }) => (
              <EditOrganizationRole
                organizationId={Number.parseInt(organizationId, 10)}
                organizationRoleId={Number.parseInt(organizationRoleId, 10)}
              />
            )}
          />
          <Route
            path="/:id"
            render={({ match: { params: { id } } }) => (
              <OrganizationDisplay organizationId={Number.parseInt(id, 10)} />
            )}
          />
          <Route path="/" render={() => <OrganizationIndex />} />
        </Switch>
      </>
    </BrowserRouter>
  );
}

OrganizationAdmin.propTypes = {
  basename: PropTypes.string.isRequired,
};

export default OrganizationAdmin;

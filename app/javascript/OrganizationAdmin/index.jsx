import React from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import EditOrganizationRole from './EditOrganizationRole';
import NewOrganizationRole from './NewOrganizationRole';
import OrganizationDisplay from './OrganizationDisplay';
import OrganizationIndex from './OrganizationIndex';

function OrganizationAdmin({ basename }) {
  return (
    <BrowserRouter basename={basename}>
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
    </BrowserRouter>
  );
}

OrganizationAdmin.propTypes = {
  basename: PropTypes.string.isRequired,
};

export default OrganizationAdmin;

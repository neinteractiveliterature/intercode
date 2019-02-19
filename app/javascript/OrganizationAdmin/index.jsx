import React from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import OrganizationDisplay from './OrganizationDisplay';
import OrganizationIndex from './OrganizationIndex';

function OrganizationAdmin({ basename }) {
  return (
    <BrowserRouter basename={basename}>
      <Switch>
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

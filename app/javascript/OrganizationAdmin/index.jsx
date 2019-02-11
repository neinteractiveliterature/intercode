import React from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

function OrganizationAdmin({ basename }) {
  return (
    <BrowserRouter basename={basename}>
      <Switch>
        <Route path="/" render={() => 'test'} />
      </Switch>
    </BrowserRouter>
  );
}

OrganizationAdmin.propTypes = {
  basename: PropTypes.string.isRequired,
};

export default OrganizationAdmin;

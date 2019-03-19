import React from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import UsersTable from './UsersTable';

function UsersAdmin({ basename }) {
  return (
    <BrowserRouter basename={basename}>
      <Switch>
        <Route path="/" render={() => <UsersTable />} />
      </Switch>
    </BrowserRouter>
  );
}

UsersAdmin.propTypes = {
  basename: PropTypes.string.isRequired,
};

export default UsersAdmin;

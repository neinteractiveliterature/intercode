import React from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import UsersTable from './UsersTable';
import UserAdminDisplay from './UserAdminDisplay';

function UsersAdmin({ basename, exportUrl }) {
  return (
    <BrowserRouter basename={basename}>
      <Switch>
        <Route path="/:id" render={({ match: { params: { id } } }) => <UserAdminDisplay userId={Number.parseInt(id, 10)} />} />
        <Route path="/" render={() => <UsersTable exportUrl={exportUrl} />} />
      </Switch>
    </BrowserRouter>
  );
}

UsersAdmin.propTypes = {
  basename: PropTypes.string.isRequired,
  exportUrl: PropTypes.string.isRequired,
};

export default UsersAdmin;

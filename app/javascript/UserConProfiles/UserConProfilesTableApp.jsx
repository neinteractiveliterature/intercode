import React from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter } from 'react-router-dom';

import UserConProfilesTable from './UserConProfilesTable';

const UserConProfilesTableApp = ({
  basename,
  exportUrl,
}) => (
  <BrowserRouter basename={basename}>
    <UserConProfilesTable
      exportUrl={exportUrl}
      defaultVisibleColumns={['name', 'email', 'ticket', 'privileges']}
    />
  </BrowserRouter>
);

UserConProfilesTableApp.propTypes = {
  basename: PropTypes.string.isRequired,
  exportUrl: PropTypes.string.isRequired,
};

export default UserConProfilesTableApp;

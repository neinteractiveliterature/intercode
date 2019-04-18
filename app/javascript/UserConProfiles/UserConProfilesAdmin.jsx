import React from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import EditTicket from './EditTicket';
import EditUserConProfile from './EditUserConProfile';
import NewTicket from './NewTicket';
import UserConProfileAdminDisplay from './UserConProfileAdminDisplay';
import UserConProfilesTable from './UserConProfilesTable';

const UserConProfilesAdmin = ({
  basename,
  exportUrl,
}) => {
  const renderAttendeesTable = () => (
    <React.Fragment>
      <h1>Attendees</h1>
      <UserConProfilesTable
        exportUrl={exportUrl}
        defaultVisibleColumns={['name', 'email', 'ticket', 'privileges']}
      />
    </React.Fragment>
  );

  return (
    <BrowserRouter basename={basename}>
      <Switch>
        <Route path="/new" render={renderAttendeesTable} />
        <Route
          path="/:id/admin_ticket/new"
          render={({ match }) => (
            <NewTicket userConProfileId={Number.parseInt(match.params.id, 10)} />
          )}
        />
        <Route
          path="/:id/admin_ticket/edit"
          render={({ match }) => (
            <EditTicket userConProfileId={Number.parseInt(match.params.id, 10)} />
          )}
        />
        <Route
          path="/:id/edit"
          render={({ match }) => <EditUserConProfile id={Number.parseInt(match.params.id, 10)} />}
        />
        <Route
          path="/:id"
          render={({ match }) => (
            <UserConProfileAdminDisplay userConProfileId={Number.parseInt(match.params.id, 10)} />
          )}
        />
        <Route render={renderAttendeesTable} />
      </Switch>
    </BrowserRouter>
  );
};

UserConProfilesAdmin.propTypes = {
  basename: PropTypes.string.isRequired,
  exportUrl: PropTypes.string.isRequired,
};

export default UserConProfilesAdmin;

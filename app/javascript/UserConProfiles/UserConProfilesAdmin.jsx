import React from 'react';
import { Switch, Route } from 'react-router-dom';

import EditTicket from './EditTicket';
import EditUserConProfile from './EditUserConProfile';
import NewTicket from './NewTicket';
import UserConProfileAdminDisplay from './UserConProfileAdminDisplay';
import UserConProfilesTable from './UserConProfilesTable';

const UserConProfilesAdmin = () => {
  const renderAttendeesTable = () => (
    <React.Fragment>
      <h1>Attendees</h1>
      <UserConProfilesTable
        exportUrl="/user_con_profiles/export.csv"
        defaultVisibleColumns={['name', 'email', 'ticket', 'privileges']}
      />
    </React.Fragment>
  );

  return (
    <Switch>
      <Route path="/user_con_profiles/new" render={renderAttendeesTable} />
      <Route
        path="/user_con_profiles/:id/admin_ticket/new"
        render={({ match }) => (
          <NewTicket userConProfileId={Number.parseInt(match.params.id, 10)} />
        )}
      />
      <Route
        path="/user_con_profiles/:id/admin_ticket/edit"
        render={({ match }) => (
          <EditTicket userConProfileId={Number.parseInt(match.params.id, 10)} />
        )}
      />
      <Route
        path="/user_con_profiles/:id/edit"
        render={({ match }) => <EditUserConProfile id={Number.parseInt(match.params.id, 10)} />}
      />
      <Route
        path="/user_con_profiles/:id"
        render={({ match }) => (
          <UserConProfileAdminDisplay userConProfileId={Number.parseInt(match.params.id, 10)} />
        )}
      />
      <Route render={renderAttendeesTable} />
    </Switch>
  );
};

export default UserConProfilesAdmin;

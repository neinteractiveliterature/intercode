import React from 'react';
import { Switch, Route } from 'react-router-dom';

import EditTicket from './EditTicket';
import EditUserConProfile from './EditUserConProfile';
import NewTicket from './NewTicket';
import UserConProfileAdminDisplay from './UserConProfileAdminDisplay';
import UserConProfilesTable from './UserConProfilesTable';
import usePageTitle from '../usePageTitle';
import useAuthorizationRequired from '../Authentication/useAuthorizationRequired';

function AttendeesPage() {
  usePageTitle('Attendees');

  return (
    <>
      <h1 className="mb-4">Attendees</h1>
      <UserConProfilesTable
        defaultVisibleColumns={['name', 'email', 'ticket', 'privileges']}
      />
    </>
  );
}

function UserConProfilesAdmin() {
  const authorizationWarning = useAuthorizationRequired('can_read_user_con_profiles');
  if (authorizationWarning) return authorizationWarning;

  return (
    <Switch>
      <Route path="/user_con_profiles/new"><AttendeesPage /></Route>
      <Route path="/user_con_profiles/:id/admin_ticket/new"><NewTicket /></Route>
      <Route path="/user_con_profiles/:id/admin_ticket/edit"><EditTicket /></Route>
      <Route path="/user_con_profiles/:id/edit"><EditUserConProfile /></Route>
      <Route path="/user_con_profiles/:id"><UserConProfileAdminDisplay /></Route>
      <Route><AttendeesPage /></Route>
    </Switch>
  );
}

export default UserConProfilesAdmin;

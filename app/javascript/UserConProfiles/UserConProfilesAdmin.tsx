import { Routes, Route } from 'react-router-dom';

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
      <UserConProfilesTable defaultVisibleColumns={['name', 'email', 'ticket', 'privileges']} />
    </>
  );
}

function UserConProfilesAdmin(): JSX.Element {
  const authorizationWarning = useAuthorizationRequired('can_read_user_con_profiles');
  if (authorizationWarning) return authorizationWarning;

  return (
    <Routes>
      <Route path="/user_con_profiles/new" element={<AttendeesPage />} />
      <Route path="/user_con_profiles/:id/admin_ticket/new" element={<NewTicket />} />
      <Route path="/user_con_profiles/:id/admin_ticket/edit" element={<EditTicket />} />
      <Route path="/user_con_profiles/:id/edit" element={<EditUserConProfile />} />
      <Route path="/user_con_profiles/:id" element={<UserConProfileAdminDisplay />} />
      <Route path="/user_con_profiles" element={<AttendeesPage />} />
    </Routes>
  );
}

export default UserConProfilesAdmin;

import { Routes, Route } from 'react-router-dom';

import EditTicket from './EditTicket';
import EditUserConProfile from './EditUserConProfile';
import NewTicket from './NewTicket';
import UserConProfileAdminDisplay from './UserConProfileAdminDisplay';
import UserConProfilesTable from './UserConProfilesTable';
import usePageTitle from '../usePageTitle';
import useAuthorizationRequired from '../Authentication/useAuthorizationRequired';
import { useTranslation } from 'react-i18next';

function AttendeesPage() {
  const { t } = useTranslation();
  usePageTitle(t('navigation.admin.attendees'));

  return (
    <>
      <h1 className="mb-4">{t('navigation.admin.attendees')}</h1>
      <UserConProfilesTable defaultVisibleColumns={['name', 'email', 'ticket', 'privileges']} />
    </>
  );
}

function UserConProfilesAdmin(): JSX.Element {
  const authorizationWarning = useAuthorizationRequired('can_read_user_con_profiles');
  if (authorizationWarning) return authorizationWarning;

  return (
    <Routes>
      <Route path="new" element={<AttendeesPage />} />
      <Route path=":id/admin_ticket/new" element={<NewTicket />} />
      <Route path=":id/admin_ticket/edit" element={<EditTicket />} />
      <Route path=":id/edit" element={<EditUserConProfile />} />
      <Route path=":id" element={<UserConProfileAdminDisplay />} />
      <Route path="" element={<AttendeesPage />} />
    </Routes>
  );
}

export default UserConProfilesAdmin;

import { useTranslation } from 'react-i18next';
import usePageTitle from '../usePageTitle';
import UserConProfilesTable from './UserConProfilesTable';

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

export const Component = AttendeesPage;

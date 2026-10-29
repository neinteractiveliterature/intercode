import { useTranslation } from 'react-i18next';
import usePageTitle from '../usePageTitle';
import UserConProfilesTable from './UserConProfilesTable';
import { Outlet, useLoaderData } from 'react-router';
import { AttendeesPageQueryDocument } from './queries.generated';
import { apolloClientContext } from 'AppContexts';
import type { Route } from './+types/AttendeesPage';

export const clientLoader = async ({ context }: Route.ClientLoaderArgs) => {
  const client = context.get(apolloClientContext);
  const { data } = await client.query({ query: AttendeesPageQueryDocument, errorPolicy: 'none' });
  return data;
};

function AttendeesPage() {
  const { t } = useTranslation();
  const data = useLoaderData<typeof clientLoader>();
  usePageTitle(t('navigation.admin.attendees'));

  return (
    <>
      <h1 className="mb-4">{t('navigation.admin.attendees')}</h1>
      <UserConProfilesTable
        defaultVisibleColumns={['name', 'email', 'ticket', 'privileges']}
        attendeesPageQueryData={data}
        canReadTickets={data.currentAbility.can_read_tickets}
      />
      <Outlet />
    </>
  );
}

export default AttendeesPage;

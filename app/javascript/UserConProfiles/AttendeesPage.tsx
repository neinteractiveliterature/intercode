import { useTranslation } from 'react-i18next';
import usePageTitle from '../usePageTitle';
import UserConProfilesTable from './UserConProfilesTable';
import { Outlet, useLoaderData } from 'react-router';
import { AttendeesPageQueryData, AttendeesPageQueryDocument } from './queries.generated';
import { Route } from './+types/AttendeesPage';
import { apolloClientContext } from 'AppContexts';

export async function loader({ context }: Route.LoaderArgs) {
  const { data } = await context.get(apolloClientContext).query({ query: AttendeesPageQueryDocument });
  return data;
}

function AttendeesPage() {
  const { t } = useTranslation();
  const data = useLoaderData() as AttendeesPageQueryData;
  usePageTitle(t('navigation.admin.attendees'));

  return (
    <>
      <h1 className="mb-4">{t('navigation.admin.attendees')}</h1>
      <UserConProfilesTable
        defaultVisibleColumns={['name', 'email', 'ticket', 'privileges']}
        attendeesPageQueryData={data}
      />
      <Outlet />
    </>
  );
}

export default AttendeesPage;

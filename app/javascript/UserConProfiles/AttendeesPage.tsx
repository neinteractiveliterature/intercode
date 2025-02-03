import { useTranslation } from 'react-i18next';
import usePageTitle from '../usePageTitle';
import UserConProfilesTable from './UserConProfilesTable';
import { LoaderFunction, Outlet, useLoaderData } from 'react-router';
import { AttendeesPageQueryData, AttendeesPageQueryDocument } from './queries.generated';
import { client } from 'useIntercodeApolloClient';

export const loader: LoaderFunction = async () => {
  const { data } = await client.query({ query: AttendeesPageQueryDocument });
  return data;
};

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

export const Component = AttendeesPage;

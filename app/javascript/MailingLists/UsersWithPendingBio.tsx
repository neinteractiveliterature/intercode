import TabbedMailingList from './TabbedMailingList';
import usePageTitle from '../usePageTitle';
import { UsersWithPendingBioQueryData, UsersWithPendingBioQueryDocument } from './queries.generated';
import { apolloClientContext } from '../AppContexts';
import { useLoaderData } from 'react-router';
import { Route } from './+types/UsersWithPendingBio';

export const clientLoader = async ({ context }: Route.ClientLoaderArgs) => {
  const client = context.get(apolloClientContext);
  const { data } = await client.query({ query: UsersWithPendingBioQueryDocument });
  return data;
};

function UsersWithPendingBio() {
  const data = useLoaderData() as UsersWithPendingBioQueryData;
  usePageTitle('Users with pending bio');

  return (
    <>
      <h1 className="mb-4">Mail to all users with pending bio</h1>

      <TabbedMailingList
        emails={data.convention.mailing_lists.users_with_pending_bio.emails}
        metadataFields={data.convention.mailing_lists.users_with_pending_bio.metadata_fields}
        csvFilename={`Users with pending bio - ${data.convention.name}.csv`}
      />
    </>
  );
}

export const Component = UsersWithPendingBio;

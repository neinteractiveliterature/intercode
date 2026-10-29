import TabbedMailingList from './TabbedMailingList';
import usePageTitle from '../usePageTitle';
import { UsersWithPendingBioQueryDocument } from './queries.generated';
import { apolloClientContext } from '../AppContexts';
import { useLoaderData } from 'react-router';
import type { Route } from './+types/UsersWithPendingBio';

export const clientLoader = async ({ context }: Route.ClientLoaderArgs) => {
  const client = context.get(apolloClientContext);
  const { data } = await client.query({ query: UsersWithPendingBioQueryDocument, errorPolicy: 'none' });
  return data;
};

function UsersWithPendingBio() {
  const data = useLoaderData<typeof clientLoader>();
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

export default UsersWithPendingBio;

import TabbedMailingList from './TabbedMailingList';
import usePageTitle from '../usePageTitle';
import { UsersWithPendingBioQueryData, UsersWithPendingBioQueryDocument } from './queries.generated';
import { client } from '../useIntercodeApolloClient';
import { LoaderFunction, useLoaderData } from 'react-router';

export const loader: LoaderFunction = async () => {
  const { data } = await client.query<UsersWithPendingBioQueryData>({ query: UsersWithPendingBioQueryDocument });
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
